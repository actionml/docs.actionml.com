# Small High Availability Cluster Setup Guide

This is a guide to setting up Apache PredictionIO {{> pioversionnum}} in a 3 node cluster with all services running on the 3 cluster machines.

In this guide all services are setup with multiple or standby masters in true clustered mode. We generally recommend that you have 5 machines to fully decouple services and allow for shutting down Spark when it is not in use (during `pio train` for the UR). But the setup will be the same with different server addresses for each machine.

Therefore think of this as a template for cluster setup.

**Other Guides**:

{{> pioawsguide}}
{{> piosinglemachineguide}}
{{> piodistributedguide}}

## Requirements

{{> piorequiredsw}}


## Setup User, SSH, and host naming on All Hosts:

 {{> setupuser}}
 

 4. Modify `/etc/hosts` file and name each server. Don't use "localhost" or "127.0.0.1" but use either the lan DNS name or static IP address.
    
    ```
    10.0.0.1 some-master
    10.0.0.2 some-slave-1
    10.0.0.3 some-slave-2
    ```

## Download Services on all Hosts

  {{> installservices}}

## Setup Java 1.8

  {{> setupjava18}}

## Install Services:

 {{> setsymlinks}}

## Setup Hadoop Cluster

Hadoop's Distributed File System is core to Spark, HBase, and for staging of data to be imported into the EventServer and as storage for some templates. To become familiar with Hadoop installation read [this tutorial](http://www.tutorialspoint.com/hadoop/hadoop_multi_node_cluster.htm)

 - **File paths**: this  defines the defines where the root of HDFS will be. To write to HDFS you can reference this locations, for instance in place of a local path like `file:///home/aml/file` you could read or write `hdfs://some-master:9000/user/aml/file` Once you have HDFS set up you can often omit the `hdfs://some-master:9000/user/aml/` since it is the default prefix to a file or directory name when you are logged in to the same `aml` user. We have the sofware installed, now let's setup the services
 
 - **`etc/hadoop/core-site.xml`**

    ```
    <configuration>
      <property>
        <name>fs.defaultFS</name>
        <value>hdfs://some-master:9000</value>
      </property>
    </configuration>
    ```

 - **`etc/hadoop/hadoop/hdfs-site.xml`** This sets the actual filesystem location that hadoop will use to save data and how many copies of the data to be kept. In case of storage corruption, hadoop will restore from a replica and eventually restore replicas. If a server goes down, all data on that server will be re-created if you have at a `dfs.replication` of at least 2 to avoid one disk's failure loosing data. 

    ```
    <configuration>
       <property>
          <name>dfs.data.dir</name>
          <value>file:///usr/local/hadoop/dfs/name/data</value>
          <final>true</final>
       </property>
    
       <property>
          <name>dfs.name.dir</name>
          <value>file:///usr/local/hadoop/dfs/name</value>
          <final>true</final>
       </property>
    
       <property>
          <name>dfs.replication</name>
          <value>2</value>
       </property>
    </configuration>
    ```

 - **`etc/hadoop/masters`** One master for this config. HA would require at least a standby master also.

	```
	some-master
	```

 - **`etc/hadoop/slaves`** Slaves for HDFS means they have datanodes so the master may also host data with this config

    ```
    some-master
    some-slave-1
    some-slave-2
    ```

 - **`etc/hadoop/hadoop-env.sh`** make sure the following values are set

    ```
    export JAVA_HOME=${JAVA_HOME}
    # this has been set for hadoop historically but not sure it is needed anymore
    export HADOOP_OPTS=-Djava.net.preferIPv4Stack=true
    export HADOOP_CONF_DIR=${HADOOP_CONF_DIR:-"/etc/hadoop"}
    ```

 - **Put HDFS on the path**: Adding a path to the hdfs command will save a lot of typing and is seen in other documentation. Add `/usr/local/hadoop/bin/` and `/usr/local/hadoop/sbin/` to your execution path in bash `.profile` or other personalization file for your shell. Make sure to source the changes with `. ~/.profile` to activate the path changes.

 - **Format Namenode** This will result actions logged to the terminal, make sure there are no errors
 
    ```
    hadoop namenode -format
    ```

 - **Start the dfs servers** only since we only use the HDFS part of Hadoop. Do not use `sbin/start-all.sh` because it will needlessly start mapreduce and yarn. These can work together with PredictionIO but for the purposes of this guide they are not needed.

    ```
    start-dfs.sh
    ```

 - **Create required HDFS directories**

    ```
    hdfs dfs -mkdir /hbase
    hdfs dfs -mkdir /zookeeper
    hdfs dfs -mkdir /models
    hdfs dfs -mkdir /user
    hdfs dfs -mkdir /user/aml # will be like ~ for user "aml"
    ```

## Setup Spark Cluster

 - Spark is used extensively by PredictionIO so it is well to understand how it works. Read and follow [this tutorial](http://spark.apache.org/docs/latest/spark-standalone.html) Also checkout the brief introduction [here](/docs/intro_to_spark) The primary thing that must be setup is the master and slaves, which for our purposes will be the same as for Hadoop.

 - `conf/masters` One master for this config.

	```
	some-master
	```

  - `conf/slaves` Slaves for Spark means they are workers so the master be included

        some-master
        some-slave-1
        some-slave-2


- Start all nodes in the cluster

    `sbin/start-all.sh`


## Setup Elasticsearch Cluster

- Change the `/usr/local/elasticsearch/config/elasticsearch.yml` file as shown below. This is minimal and allows all hosts to act as backup masters in case the acting master goes down. Also all hosts are data/index nodes so can respond to queries and host shards of the index.

    The `cluster.name` defines the Elasticsearch machines that form a cluster. This is used by Elasticsearch to discover other machines and should not be set to any other PredictionIO id like appName. It is also important that the cluster name not be left as default or your machines may join up with others on the same LAN.

    ```
    cluster.name: some-cluster-name
    discovery.zen.ping.multicast.enabled: false # most cloud services don't allow multicast
    discovery.zen.ping.unicast.hosts: ["some-master", "some-slave-1", "some-slave-2"] # add all hosts, masters and/or data nodes
    ```

- copy Elasticsearch and config to all hosts using `scp -r /opt/elasticsearch/... aml@some-host://opt/elasticsearch`. Like HBase, all hosts are identical.

## Setup HBase Cluster

This [tutorial](https://hbase.apache.org/book.html#quickstart_fully_distributed) is the **best guide**, many others produce incorrect results . The primary thing to remember is to install and configure on a single machine, adding all desired hostnames to `backupmasters`, `regionservers`, and to the `hbase.zookeeper.quorum` config param, then copy **all code and config** to all other machines with something like `scp -r ...` Every machine will then be identical.

Configure with these changes to `/usr/local/hbase/conf`

 - **`conf/hbase-site.xml`**

    ```
    <configuration>
        <property>
            <name>hbase.rootdir</name>
            <value>hdfs://some-master:9000/hbase</value>
        </property>
    
        <property>
            <name>hbase.cluster.distributed</name>
            <value>true</value>
        </property>
    
        <property>
            <name>hbase.zookeeper.property.dataDir</name>
            <value>hdfs://some-master:9000/zookeeper</value>
        </property>
    
        <property>
            <name>hbase.zookeeper.quorum</name>
            <value>some-master,some-slave-1,some-slave-2</value>
        </property>
    
        <property>
            <name>hbase.zookeeper.property.clientPort</name>
            <value>2181</value>
        </property>
    </configuration>
    ```

 - **`conf/regionservers`**

    ```
    some-master
    some-slave-1
    some-slave-2
    ```

- **`conf/backupmasters`**

    ```
    some-slave-1
    ```

- **`conf/hbase-env.sh`**

    ```
	export JAVA_HOME=${JAVA_HOME}
	export HBASE_MANAGES_ZK=true # when you want HBase to manage zookeeper
    ```

- **Start HBase**

    ```
    bin/start-hbase.sh
    ```

At this point you should see several different processes start on the master and slaves including regionservers and zookeeper servers. If there is an error check the log files referenced in the error message. These log files may reside on any of the hosts as indicated in the file's name.

**Note:** It is strongly recommend to setup these files in the master `/usr/local/hbase` folder and then copy **all** code and sub-folders or the to the slaves. All members of the cluster must have exactly the same code and config


## Setup PredictionIO

Setup PIO on the master or on all servers (if you plan to use a load balancer). The Setup **must not** use the install.sh since you are using clustered services and that script only supports a standalone machine. See the [Installing PredictionIO](/docs/install) page for instructions.

  {{> build_pio}}


 - **Setup PredictionIO** to connect to the services

   You have PredictionIO in `~/aml` so edit ~/pio-aml/conf/pio-env.sh to have these settings:

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
    PIO_STORAGE_REPOSITORIES_METADATA_NAME=pio_meta
    PIO_STORAGE_REPOSITORIES_METADATA_SOURCE=ELASTICSEARCH
        
    PIO_STORAGE_REPOSITORIES_EVENTDATA_NAME=pio_event
    PIO_STORAGE_REPOSITORIES_EVENTDATA_SOURCE=HBASE
        
    # Need to use HDFS here instead of LOCALFS to enable deploying to 
    # machines without the local model
    PIO_STORAGE_REPOSITORIES_MODELDATA_NAME=pio_model
    PIO_STORAGE_REPOSITORIES_MODELDATA_SOURCE=HDFS
        
    # What store to use for what data     
    # Elasticsearch Example
    PIO_STORAGE_SOURCES_ELASTICSEARCH_TYPE=elasticsearch
    PIO_STORAGE_SOURCES_ELASTICSEARCH_HOME=/usr/local/elasticsearch
    # The next line should match the ES cluster.name in ES config
    PIO_STORAGE_SOURCES_ELASTICSEARCH_CLUSTERNAME=some-cluster-name
        
    # For clustered Elasticsearch (use one host/port if not clustered)
    PIO_STORAGE_SOURCES_ELASTICSEARCH_HOSTS=some-master,some-slave-1,some-slave-2
    # PIO 0.12.0+ uses the REST client for ES 5+ and this defaults to 
    # port 9200, change if appropriate but do not use the Transport Client port
    # PIO_STORAGE_SOURCES_ELASTICSEARCH_PORTS=9200,9200,9200
        
    PIO_STORAGE_SOURCES_HDFS_TYPE=hdfs
    PIO_STORAGE_SOURCES_HDFS_PATH=hdfs://some-master:9000/models
        
    # HBase Source config
    PIO_STORAGE_SOURCES_HBASE_TYPE=hbase
    PIO_STORAGE_SOURCES_HBASE_HOME=/usr/local/hbase
        
    # Hbase clustered config (use one host/port if not clustered)
    PIO_STORAGE_SOURCES_HBASE_HOSTS=some-master,some-slave-1,some-slave-2
    ```

- **Start PIO**: The helper command should run on the master to start Elasticsearch, HBase, and PIO

    ```
    pio-start-all
    pio status
    ```

   The status of all the stores is checked and will be printed but no check is made of the HDFS or Spark services so check them separately by looking at their GUI status pages. They are here:

  - HDFS: http://some-master:50070
  - Spark: http://some-master:8080

## Setup Your Template

See the template setup instructions. The Universal Recommender can be installed with its [quickstart](/docs/ur_quickstart).

## Scaling for Load Balancers

See [**PredictionIO Load Balancing**](pio_load_balancing)
