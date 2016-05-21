Add partials as markdown templates here for inclusion in other templates. Must start and stop with a newline, use helpers for string inclusions.
{{#template name='pio_version'}}
PredictionIO-v0.9.7-aml
{{/template}}

{{#template name='piosetupguides'}}
Choose the guide that best fits your needs.

{{> piosinglemachineguide}}
{{> piosmallhaguide}}
{{> piodistributedguide}}
{{/template}}

{{#template name='piosinglemachineguide'}}
 - **[Single Machine](/docs/single_machine)**: This sets up a single machine to run all services but does so in a way that allows for easier cluster expansion in the future.
{{/template}}

{{#template name='piosmallhaguide'}}
 - **[Small High Availability Cluster](/docs/small_ha_cluster)**: This sets up a 3 machine cluster with all services running on all machines with no single point of failure. This setup will allow you to expand by moving clustered services into their own cluster as needed. For instance Spark may be moved to separate machines for scaling purposes. 
{{/template}}

{{#template name='piodistributedguide'}}
 - **[Fully Distributed Clusters](/docs/single_driver_machine)**: This creates a "Driver" machine that can run PIO when all services are in external clusters. This represents the ultimate in scalability since the clusters can be scaled independently.
{{/template}}

{{#template name='urworkflow'}}

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

{{/template}}

{{#template name='setsymlinks'}}
5.2 Move extracted services to their folders.

	sudo mv /tmp/downloads/hadoop-2.6.2 /opt/hadoop/
	sudo mv /tmp/downloads/spark-1.6.1 /opt/spark/
	sudo mv /tmp/downloads/elasticsearch-1.7.5 /opt/elasticsearch/
	sudo mv /tmp/downloads/hbase-1.2.1 /opt/hbase/

**Note:** Keep version numbers, if you upgrade or downgrade in the future just create new symlinks.

5.3 Symlink Folders

	sudo ln -s /opt/hadoop/hadoop-2.6.2 /usr/local/hadoop
	sudo ln -s /opt/spark/spark-1.6.1 /usr/local/spark
	sudo ln -s /opt/elasticsearch/elasticsearch-1.7.5 /usr/local/elasticsearch
	sudo ln -s /opt/hbase/hbase-1.2.1 /usr/local/hbase
	sudo ln -s /home/aml/pio-aml /usr/local/pio-aml		
{{/template}}
