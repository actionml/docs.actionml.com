{{#template name='single_driver_machine'}}
# PredictionIO Standalone Server Guide: The Driver Machine

This is a guide to setting up the PredictionIO model training machine for templates like the Universal Recommender, which only use Spark for `pio train`. For the UR there is no need to run this on more than one machine since the input data, model (created by `pio train`), and queries are using shared services. This means the Spark "driver" (`pio train`) can be run on a temporary machine that is created, trained on, then destroyed along with a temporary Spark cluster. This will have no effect on the other parts of the systems that ingest data and return query results.
At the end of this guide we will spin up a Spark cluster and offload the majority of training work to the cluster, then take it offline so it costs nothing while idle.

This machine will run no services itself. It expects to connect to external HDFS, HBase, and Spark and to run `pio train` to create a model, which is stored on some shared service (Elasticsearch in the case of the UR).

Focus on this part of the standard PIO workflow.

![image](/docs/images/ur-train.svg)

## AWS

Create an instance on AWS orother cloud PaaS provider, and make sure the machine has enough memory to run the training part of pio. For the UR this will vary greatly from 8g upwards. This will be something like an r3.xlarge or r3.2xlarge. The machine should match the Spark Executor machines for memory size since the driver and executors need roughly the same amount.

## Before You Start

Read the [Small HA Cluster instructions](/docs/small-ha-cluster.md) but note that we need instalation jars only for getting configuration information, scripts, or client launcher code (in the case of Spark).



	
 - get the Universal Recommender

        git clone https://github.com/actionml/template-scala-parallel-universal-recommendation/tree/v0.3.0 universal
        cd universal
        pio app list # to see datasets in the EventServer
        pio app new handmade # if the app is not there
        python examples/import_handmade.py --access_key key-from-app-list

 - to retrain after any change to data or engin.json
 
        pio build # do this before every train
        pio train -- --master spark://some-master:7077 --driver-memory 3g

 - to retrain after a pio config change first restart pio as above, them retrain, no need to reimport unless you have rebuild HBase, in which case start from "start platform services" above.

{{/template}}