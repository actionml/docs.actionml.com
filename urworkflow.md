### Get PIO and required services running

 - start platform services
 
        $ /usr/local/hadoop/sbin/start-dfs.sh
        $ /usr/local/spark/start-all.sh # if using the local host to run Spark

 - start the pio services and the EventServer

        $ pio-start-all

### To restart to a clean state

 - stop pio

        $ pio-stop-all
        
    if this does not complete cleanly you may have a config problem so kill services by hand. Since `pio-stop-all` stops everything but HDFS and Spark we check to see if anything else is running 

        $ jps -lm
        $ # check for orphaned HMaster, HRegionServer, HQuorumServer
        $ # or Console and kill separately to get a clean state
        $ kill some-pid
        
 - start PIO

        $ pio-start-all
 
### Prepare to import Events
        
 - install pip to import data to the EventServer

        $ sudo apt-get install python-pip 
        
    Check the [pip installation guide](https://pip.pypa.io/en/stable/installing/) if you aren't using Ubuntu
        
        $ sudo pip install predictionio
        $ sudo pip install datetime
	
### Build The Universal Recommender

 - get the code and import sample data

        $ git clone https://github.com/actionml/template-scala-parallel-universal-recommendation/tree/v0.3.0 universal
        $ cd universal
        $ pio app list # to see datasets in the EventServer
        $ pio app new handmade # if the app is not there
        $ python examples/import_handmade.py --access_key key-from-app-list

 - to train or retrain after any change to data or engine.json
 
        $ pio build # do this before every train
        $ pio train -- --master spark://some-master:7077 --driver-memory 3g

 - now that you have a model trained deploy the PredictionServer

        $ nohup pio deploy & # ready for queries on port 8000

 - to make sample queries

        $ ./examples/multi-query-handmade.sh

    The query script has many examples of query types supported by the UR and is a good source to draw from.

 - to retrain after a pio config change first restart pio as above, them retrain, no need to reimport unless you have rebuild HBase, in which case start from "start platform services" above.
