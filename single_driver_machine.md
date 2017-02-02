# PredictionIO Standalone Server Guide: The Driver Machine

This is a guide to setting up the PredictionIO model training machine for templates like the Universal Recommender, which only use Spark for `pio train`. For the UR there is no need to run this on more than one machine since the input data, model (created by `pio train`), and queries are using shared services. This means the Spark "driver" (`pio train`) can be run on a temporary machine that is created, trained on, then destroyed along with a temporary Spark cluster. This will have no effect on the other parts of the systems that ingest data and return query results.
At the end of this guide we will spin up a Spark cluster and offload the majority of training work to the cluster, then take it offline so it costs nothing while idle.

This machine will run no services itself. It expects to connect to external HDFS, HBase, and Spark and to run `pio train` to create a model, which is stored on some shared service (Elasticsearch in the case of the UR).

Focus on this part of the standard PIO workflow.

![image](/docs/images/ur-train.svg)

## AWS

Create an instance on AWS or other cloud PaaS provider, and make sure the machine has enough memory to run the training part of pio. For the UR this will vary greatly from 16g minimum upwards. This will be something like an r3.xlarge or r3.2xlarge. The machine should match the Spark Executor machines for memory size since the driver and executors need roughly the same amount.

## Prep the Machine

Read and follow the [Small HA Cluster instructions](/docs/small_ha_cluster) but note that we need instalation jars only for getting configuration information, scripts, or client launcher code (in the case of Spark). **Do not start any service on this machine** except the EventServer and PredictionServer! This is very important. All services are expected to be already running on other machines. 

## Configure PIO

Edit `/usr/local/pio/conf/pio-env.sh` replace the contents with the following, making sure to update all server IP addresses to match the masters of the already running remote clusters of Elasticsearch, HDFS, HBase, and Spark:

```
# Safe config that will work if you expand your cluster later
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

Once Spark is instantiated and running you make execute your template's `pio train` command and run `pio deploy` on some other machine that will host the permanent PredictionServer and EventServer.