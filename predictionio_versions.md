{{#template name= 'predictionio_versions'}}
# PredictionIO-aml-v0.9.7

ActionML maintains an enhanced version of PredictionIO starting with v0.9.6. The key changes from v0.9.5 are:

## SelfCleaningDataSource

The most important new feature in ActionML's version of PredictionIO v0.9.6 is the `SelfCleaningDataSource`. This allows any template to specify an age for events. When events get too old they are removed permanently from the EventServer. It also allows a template to de-duplicate events, and to compact $set/$unset property change events.

The `SelfCleaningDataSource` must be added to a template with a very simple code change and has already been added to the Universal Recommender template. To add this feature to any template simple inherit `SelfCleaningDataSource` from your DataSource as is done in the UR [here](https://github.com/actionml/template-scala-parallel-universal-recommendation/blob/v0.3.0/src/main/scala/DataSource.scala#L49).

### Template Code Change

Find the DataSource class in your template code and add the `with` clause and the `logger`, `appName` and `eventWindow`like this:

	class DataSource(val dsp: DataSourceParams)
	  extends PDataSource[TrainingData, EmptyEvaluationInfo, Query, EmptyActualResult] 
	  //======= copy from here ===========
	  with SelfCleaningDataSource {
	
	  @transient override lazy val logger = Logger[this.type]
	
	  override def appName = dsp.appName
	  override def eventWindow = dsp.eventWindow
	  //======= to here ===========
	  
	  ...
	}
  
To use the newly extended `DataSource` simply add parameters to the engine.json described below and make this call:
    
    def readTraining(sc: SparkContext): TrainingData = {
        // add this line to clean PEvents
        cleanPersistedPEvents(sc)

before you access PEvents. **Note**: Be aware that the old aged out events are permanently removed from the DataSource so keep a backup if you are experimenting. 

### Parameters

Then configure the DataSource operation in engine.json as follows:

	  "datasource": {
	    "params" : {
	      "name": "some-name",
	      "appName": "some-app-name",
	      "eventNames": ["purchase", "view"],
	      "eventWindow": {
	        "duration": "3650 days",
            "removeDuplicates": false,
            "compressProperties": false
	      }
	    }
	  }

 - **eventWindow**: This is optional and controls how much of the data in the EventServer to keep and how to compress events. The default it to not have a time window and do no compression. This will compact and drop old events from the EventServer permanently in the persisted data&mdash;so make sure to have some other archive of events it you are playing with the `timeWindow: duration:`.
	 - **duration**: This is parsed for "days", "hours", and "minutes" and becomes a Scala `Duration` object defining the time from now backward to the point where older events will be dropped. $set property change events are never dropped. Default is to never drop events.
	 - **removeDuplicates** a boolean telling the DataSource to de-duplicate events, defaults to `false`.
	 - **compressProperties**: a boolean telling the Datasource to compress property change events into one event expressing the current state of all properties, defaults to `false`.
{{/template}}