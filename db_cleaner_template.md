# The Db-cleaner Template

Big-data is one thing, infinite data is another and one to be avoided unless you have infinite resources. PredictionIO has methods you can add to your template to trim old events from your EventStore but by default these are not active in most templates. To make your template "self-cleaning" see the discussion below. 

ActionMl also maintains a template for use with any other template that can be scheduled to periodically trim and compress any EventStore App's data. See the `db-cleaner` template [here](https://github.com/actionml/db-cleaner). 

Download the template as you would with any template and go through the PIO workflow to `pio build` and `pio train`. `pio deploy` is not necessary since the work is done during `pio train`.

An example simple `engine.json` is:

    {
      "id": "default",
      "description": "Default settings",
      "engineFactory": "com.actionml.templates.dbcleaner.DBCleaner",
      "datasource": {
        "params" : {
          "appName": "test-app",
          "eventWindow": {
            "duration": "4 days",
            "removeDuplicates": true,
            "compressProperties": true
          }
        }
      },
      "algorithms": [
        {
          "name": "db-cleaner-algo",
          "params": {
            "appName": "test-app"
          }
        }
      ]
    }

 - **appName**: This is vey important and identified the data to be modified. This is usually the `appName` used by another template. **Warning**: this will cause "trimmed" or older events than allowed in the eventWindow to be dropped from your EventStore. Backup before performing this on you live data.
 - **eventWindow**: This is optional and controls how much of the data in the EventServer to keep and how to compress events. The default it to not have a time window and do no compression. This will compact and drop old events from the EventServer permanently in the persisted data&mdash;so make sure to have some other archive of events it you are playing with the `timeWindow: duration:`.
	 - **duration**: This is parsed for "days", "hours", and "minutes" and becomes a Scala `Duration` object defining the time from now backward to the point where older events will be dropped. $set property change events are never dropped. Default is to never drop events. If ru n periodically the `eventWindow` will maintain a moving window of events in time. dropping old events as the expire out of the window. For recommenders this time is usually as long as you can support with your storage and training resources. Use the `eventWindow` to reduce training time and the cost of computers to do this. It also maintains storage at a fairly constant level so you may set this to match the amount of storage you have available.
	 - **removeDuplicates** a boolean telling the DataSource to de-duplicate events, defaults to `false`. This can add a good deal of calculation time and is often not necessary.
	 - **compressProperties**: a boolean telling the Datasource to compress property change events into one event expressing the current state of all properties, defaults to `false`. This can add a good deal of calculation time and is often not necessary.

The minimal config is in `engine.json.template` and does not include the optional de-duping and property compression.

    {
      "id": "default",
      "description": "Default settings",
      "engineFactory": "com.actionml.templates.dbcleaner.DBCleaner",
      "datasource": {
        "params" : {
          "appName": "test-app",
          "eventWindow": {
            "duration": "4 days"
          }
        }
      },
      "algorithms": [
        {
          "name": "db-cleaner-algo",
          "params": {
            "appName": "test-app"
          }
        }
      ]
    }

# Add This Feature to Your Template

The `SelfCleaningDataSource` allows any template to specify an age for events. When events get too old they are removed permanently from the EventServer. It also allows a template to de-duplicate events, and to compact $set/$unset property change events.

The `SelfCleaningDataSource` must be added to a template with a very simple code change and has already been added to the Universal Recommender template. To add this feature to any template simple inherit `SelfCleaningDataSource` from your DataSource as is done in the UR [here](https://github.com/actionml/template-scala-parallel-universal-recommendation/blob/v0.3.0/src/main/scala/DataSource.scala#L49).

## Template Code Change

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

## Parameters

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
	 - **removeDuplicates** a boolean telling the DataSource to de-duplicate events, defaults to `false`. This can add a good deal of calculation time and is often not necessary.
	 - **compressProperties**: a boolean telling the Datasource to compress property change events into one event expressing the current state of all properties, defaults to `false`. This can add a good deal of calculation time and is often not necessary.
