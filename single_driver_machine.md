{{#template name='single_driver_machine'}}
# PredictionIO Standalone Server Guide: The Driver Machine

This is a guide to setting up the PredictionIO model training machine for templates like the Universal Recommender, which only use Spark for `pio train`. For the UR there is no need to run this on more than one machine since the input data, model (created by `pio train`), and queries are using shared services. This means the Spark "driver" (`pio train`) can be run on a temporary machine that is created, trained on, then destroyed along with a temporary Spark cluster. This will have no effect on the other parts of the systems that ingest data and return query results.
At the end of this guide we will spin up a Spark cluster and offload the majority of training work to the cluster, then take it offline so it costs nothing while idle.

This machine will run no services itself. It expects to connect to external HDFS, HBase, and Spark and to run `pio train` to create a model, which is stored on some shared service (Elasticsearch in the case of the UR).

Focus on this part of the standard PIO workflow.

![image](/docs/images/ur-train.svg)

## AWS

Create an instance on AWS or other cloud PaaS provider, and make sure the machine has enough memory to run the training part of pio. For the UR this will vary greatly from 8g upwards. This will be something like an r3.xlarge or r3.2xlarge. The machine should match the Spark Executor machines for memory size since the driver and executors need roughly the same amount.

## Prep the Machine

Read the [Small HA Cluster instructions](/docs/small-ha-cluster.md) but note that we need instalation jars only for getting configuration information, scripts, or client launcher code (in the case of Spark).

### 1. Setup the aml User:

1.1 Create user for PredictionIO `aml`

    adduser aml # Give it some password

1.2 Give the `aml` user sudoers permissions and login to the new user. This setup assumes the aml user as the **owner of all services** including Spark and Hadoop (HDFS).

    usermod -a -G sudo aml
    sudo su aml # or exit and login as the aml user

Notice that we are now logged in as the `aml` user

**NOTE**: Setup passwordless ssh to other cluster machines? Not sure that this is required.

## 2. Setup Java 1.7 or 1.8

2.1 Install Java OpenJDK or Oracle JDK for Java 7 or 8, the JRE version is not sufficient.

    sudo apt-get install openjdk-7-jdk

2.2 Check which versions of Java are installed and pick a 1.7 or greater.

    sudo update-alternatives --config java

2.3 Set `JAVA_HOME` env var.

Don't include the `/bin` folder in the path. This can be problematic so if you get complaints about JAVA_HOME you may need to change xxx-env.sh depending on which service complains. For instance `hbase-env.sh` has a JAVA_HOME setting if HBase complains when starting.

    # add the following to /home/aml/.bashrc
    export JAVA_HOME=/path/to/open/jdk/jre

## 3. Download Installation Jars:

Download everything to a temp folder like `/tmp/downloads`, we will later move them to the final destinations.

3.1 Download and extract service code:

 - {{> hdfsdownload}}

 - {{> sparkdownload}}

 - {{> esdownload}}

 - {{> hbasedownload}}

3.2 Create folders in `/opt`

    mkdir /opt/hadoop
    mkdir /opt/spark
    mkdir /opt/elasticsearch
    mkdir /opt/hbase
    chown aml:aml /opt/hadoop
    chown aml:aml /opt/spark
    chown aml:aml /opt/elasticsearch
    chown aml:aml /opt/hbase

3.3 Inside the `/tmp/downloads` folder, extract all downloaded services.

3.4 Move extracted services to their folders.

    sudo mv /tmp/downloads/hadoop-2.6.2 /opt/hadoop/
    sudo mv /tmp/downloads/spark-1.6.1 /opt/spark/
    sudo mv /tmp/downloads/elasticsearch-1.7.5 /opt/elasticsearch/
    sudo mv /tmp/downloads/hbase-1.2.1 /opt/hbase/

Note: Keep version numbers, if you upgrade or downgrade in the future just update symlinks.

3.4 Symlink Folders

    sudo ln -s /opt/hadoop/hadoop-2.6.2 /usr/local/hadoop
    sudo ln -s /opt/spark/spark-1.6.1 /usr/local/spark
    sudo ln -s /opt/elasticsearch/elasticsearch-1.7.5 /usr/local/elasticsearch
    sudo ln -s /opt/hbase/hbase-1.2.1 /usr/local/hbase
    sudo ln -s /home/aml/pio-aml /usr/local/pio-aml

## 4. Install {{> pioname}}

4.1 Get the ActionML version of PredictionIO and build it. Building is required because the process populates `/home/aml/.ivy2/...` cache with dependency jars that are built from the downloaded pio code. These are not available in nexus repos yet. So do not try to skip building by downloading a binary.

    git clone https://github.com/actionml/PredictionIO.git pio-aml
    cd ~/pio-aml
    git checkout master #get the latest branch
    ./make-distribution # needed to build templates

4.2 Configure PIO

Edit `/usr/local/pio/conf/pio-env.sh` replace the contents with the following, making sure to update all server IP addresses:

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

## 5. Install your Template

5.1 Clone Universal Recommender Template from its root repo into `~/universal` or do similar for any other template.

    git clone https://github.com/actionml/template-scala-parallel-universal-recommendation.git universal
	cd ~/universal
	git checkout master # or get the tag you want

5.2 Build the Template

    pio build # do this before every train

## 6. Spin Up a Spark Cluster&mdash;Docker Magic

Here lies Docker magic to create AWS instances and install and launch Spark containers. 

## 7. Train the Template

If the EventServer is running and there is data in the appName listed in `engine.json` you may now run:

    pio train -- \ # tells pio the rest of the params are for SparkSubmit
        --driver-memory 4g \
        --executor-memory 4g \
        --master spark://<some-spark-master>:7077 \
        --conf spark.eventLog.enabled=true \
        --conf spark.eventLog.dir=hdfs://<some-hdfs-master>:9000/spark-events

**NOTE**: the hdfs path `/spark-events` must already be created.

**NOTE 2**: `pio train` finds data previously stored in the EventServer directly by communicating with HBase, not through the EventServer's REST API so no pointer is needed to it.

{{/template}}