# PredictionIO Standalone Server Guide: The Driver Machine

This is a guide to setting up the PredictionIO model training machine for templates like the Universal Recommender, which only use Spark for `pio train`. The UR has no need to run of Spark for input or queries, it is only used too create models. Unfortunately the machine that launches a Spark Job must runs a Spark Driver, which may need as many resources as a Spark Executor. This means the Spark Driver (`pio train` machine) can be run on a temporary machine that is created, trained on, then stopped along with a temporary Spark cluster. This will have no effect on the other parts of the systems that ingest data and return query results.

At the end of this guide we will spin up a Spark cluster and offload the majority of training work to the cluster, then take it offline so it costs nothing while idle. In real terms this means that even if the Spark machines (driver and executors) are expensive, you will only pay the fraction of the cost associated with training and this is done weekly or less and takes hours at worst.

The PIO Spark Driver machine will run no services itself. It expects to connect to external HDFS, HBase, and Spark and to run `pio train` to create a model, which is stored in Elasticsearch.

We will be implementing this part of the standard PIO workflow.

![image](/docs/images/ur-train.svg)

## AWS

Create an instance on AWS or other cloud PaaS provider, and make sure the machine has enough memory to run the Spark Driver training part of PIO. For the UR this will vary greatly from 16g minimum upwards. This will be something like an r3.xlarge or r3.2xlarge. The machine should match the Spark Executor machines for memory size since the driver and executors need roughly the same amount.

## Prep the Machine

Read and follow the [Small HA Cluster instructions](/docs/small_ha_cluster) but note that we need installation jars only for getting configuration information, scripts, or client launcher code (in the case of Spark). **Do not start any service on this machine**! This is very important. All services are expected to be already running on other machines. 

## Configure PIO

Edit `/usr/local/pio/conf/pio-env.sh` replace the contents with the following, making sure to update all server IP addresses to match those already running Elasticsearch, HDFS, HBase, and Spark:

```
SPARK_HOME=/usr/local/spark
ES_CONF_DIR=/usr/local/elasticsearch
HADOOP_CONF_DIR=/usr/local/hadoop/etc/hadoop
HBASE_CONF_DIR=/usr/local/hbase/conf
    
    
# Filesystem paths where PredictionIO uses as block storage.
PIO_FS_BASEDIR=$HOME/.pio_store
PIO_FS_ENGINESDIR=$PIO_FS_BASEDIR/engines
PIO_FS_TMPDIR=$PIO_FS_BASEDIR/tmp
    
# PredictionIO Storage Configuration
#
# This section controls programs that make use of PredictionIO's built-in
# storage facilities. Default values are shown below.
    
# Storage Repositories
    
# Default is to use PostgreSQL but for clustered scalable setup we'll use
# Elasticsearch
PIO_STORAGE_REPOSITORIES_METADATA_NAME=pio_meta
PIO_STORAGE_REPOSITORIES_METADATA_SOURCE=ELASTICSEARCH
    
PIO_STORAGE_REPOSITORIES_EVENTDATA_NAME=pio_event
PIO_STORAGE_REPOSITORIES_EVENTDATA_SOURCE=HBASE
    
# Need to use HDFS here instead of LOCALFS to enable deploying to 
# machines without the local model
PIO_STORAGE_REPOSITORIES_MODELDATA_NAME=pio_model
PIO_STORAGE_REPOSITORIES_MODELDATA_SOURCE=HDFS
    
# Storage Data Sources, lower level that repos above, just a simple storage API
# to use
    
# Elasticsearch Example
PIO_STORAGE_SOURCES_ELASTICSEARCH_TYPE=elasticsearch
PIO_STORAGE_SOURCES_ELASTICSEARCH_HOME=/usr/local/elasticsearch
# The next line should match the ES cluster.name in ES config
PIO_STORAGE_SOURCES_ELASTICSEARCH_CLUSTERNAME=<some-cluster-name>
    
# For clustered Elasticsearch (use one host/port if not clustered)
PIO_STORAGE_SOURCES_ELASTICSEARCH_HOSTS=<some-elasticsearch-node>,<some-other-elasticsearch-node>,...
PIO_STORAGE_SOURCES_ELASTICSEARCH_PORTS=9300,9300,...
    
# model storage, required to be in hdfs but not really used
PIO_STORAGE_SOURCES_HDFS_TYPE=hdfs
PIO_STORAGE_SOURCES_HDFS_PATH=hdfs://<some-hdfs-master>:9000/models
    
# HBase Source config
PIO_STORAGE_SOURCES_HBASE_TYPE=hbase
PIO_STORAGE_SOURCES_HBASE_HOME=/usr/local/hbase
    
# Hbase clustered config (use one host/port if not clustered)
PIO_STORAGE_SOURCES_HBASE_HOSTS=<some-hbase-master>,<some-other-hbase-master>,...
PIO_STORAGE_SOURCES_HBASE_PORTS=0,0,...
```

## Setup Your Template

See the template setup instructions. The Universal Recommender can be installed with its [quickstart](/docs/ur_quickstart).

## Temporary Spark

In the diagram at the top of the page you will note that if, like The Universal Recommender, your template does not need Spark for serving queries, it can be shutdown except for the `pio train` process. This can be done by creating and configuring Spark, then using something like AWS "change instance state" to stop this driver machine and all Spark cluster machines. There are AWS APIs for doing this in an automated fashion that we use with Docker and Terraform in our Ops automation tools. [Contact ActionML](/#contact) for more information about these tools.

Once Spark is instantiated and running you may execute your template's `pio train` command and run `pio deploy` on some other machine that will host the permanent PredictionServer and EventServer.

## Train and Deploy Your Model

After data is input in the EventServer and you have configured the engine.json on this Driver machine, run `pio train -- --master spark://some-master --driver-memory 20g --executor-memory 20g`. Replace the memory with as much as you have available on Spark Driver and Executor machines.

After the task has successfully completed running on the Spark Cluster your new model will be hot swapped into used globally so there is no need to re-deploy this model. It is live after training.

## Stop Spark

Now that training is completed there is no use for Spark until the next training session. You can now (in the case of using a cloud PaaS provider like AWS) stop the machines that host the Spark Driver and Executors. If you stop them then a simple start will get the cluster running again, ready for the next `pio train`.

**Note**: `start` and `stop` as defined on AWS will leave the machines as configured, do not `create` and `destroy` or you will loose IP or DNS addresses and persistent code and data and will need to re-install to run Spark again.
