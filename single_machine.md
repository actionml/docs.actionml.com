# All-In-One PIO Setup Guide

This is a guide to setting up Apache PredictionIO {{> pioversionnum}} on a single large memory (16g-32g) machine. This will allow "real data" to be processed but will not usually be appropriate focus on horizontal scaling.

**Other Guides**:

{{> pioawsguide}}
{{> piosmallhaguide}}
{{> piodistributedguide}}

## Requirements

In this guide, all services run on a single machine and so share cores and memory. This will limit how much data can be processed and how much load can be handled and so is advised for use as an experiment or development machine.

Here we'll install and setup:

{{> piorequiredsw}}


## Setup User, SSH, and Host Naming:

 {{> setupuser}}

 4. Modify `/etc/hosts` file and this server. Don't use "localhost" or "127.0.0.1" but use either the lan DNS name or static IP address.

    ```
    10.0.0.1 some-master
    ```

## Download Services on all Hosts

  {{> installservices}}

## Setup Java 1.8

  {{> setupjava18}}

## Install Services:

 {{> setsymlinks}}

## Setup Hadoop Pseudo-Distributed Mode

Read [this tutorial](http://www.tutorialspoint.com/hadoop/hadoop_enviornment_setup.htm) especially the Pseudo-Distributed Mode. 

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

 - **`etc/hadoop/masters`** One master for this config.

	```
	some-master
	```

- **`etc/hadoop/slaves`** Slaves for HDFS means they have datanodes so the master may also host data with this config

    ```
    some-master
    ```
- **`etc/hadoop/hadoop-env.sh`** make sure the following values are set

    ```
    export JAVA_HOME=${JAVA_HOME}
    # this has been set for hadoop historically but not sure it is needed anymore
    export HADOOP_OPTS=-Djava.net.preferIPv4Stack=true
    export HADOOP_CONF_DIR=${HADOOP_CONF_DIR:-"/etc/hadoop"}
    ```

 - **Put HDFS on the path**: Adding a path to the hdfs command will save a lot of typing and is seen in other documentation. Add `/usr/local/hadoop/bin/` and `/usr/local/hadoop/sbin/` to your execution path in bash `.profile` or other personalization file for your shell. Make sure to source the changes with `. ~/.profile` to activate the path changes.

- **Format Namenode**

    ```
    bin/hadoop namenode -format
    ```

    This will result actions logged to the terminal, make sure there are no errors

- **Start the dfs servers** only since we only use the HDFS part of Hadoop. Do not use `sbin/start-all.sh` because it will needlessly start mapreduce and yarn. These can work together with PredictionIO but for the purposes of this guide they are not needed.

    ```
    sbin/start-dfs.sh
    ```

- **Create required HDFS directories**

    ```
    hdfs dfs -mkdir /hbase
    hdfs dfs -mkdir /zookeeper
    hdfs dfs -mkdir /models
    hdfs dfs -mkdir /user
    hdfs dfs -mkdir /user/aml # will be like ~ for user "aml"
    ```

## Setup Spark Cluster.

- Read and follow [this tutorial](http://spark.apache.org/docs/latest/spark-standalone.html) The primary thing that must be setup is the masters and slaves, which for our purposes will be the same as for hadoop

-  **`conf/masters`** One master for this config.

    ```
   some-master
    ```

  - **`conf/slaves`** Slaves for Spark means they are workers so the master be included

    ```
    some-master
    ```

- **Start all nodes** in the cluster

    ```
    sbin/start-all.sh
    ```

   This starts Spark in pseudo-clustered "stand-alone" mode, meaning the driver and one executor will run on `some-master`, which is the current host. It also means the jobs are managed by Spark rather than Yarn or Mesos. This mode most closely resemble how you would set up Spark in a real cluster.

## Setup Elasticsearch Cluster

- Change the `/usr/local/elasticsearch/config/elasticsearch.yml` file as shown below. This is minimal and allows all hosts to act as backup masters in case the acting master goes down. Also all hosts are data/index nodes so can respond to queries and host shards of the index. So even though we are using one machine it most closely resembles a clustered setup.

    The `cluster.name` defines the Elasticsearch machines that form a cluster. This is used by Elasticsearch to discover other machines and should not be set to any other PredictionIO id like appName. It is also important that the cluster name not be left as default or your machines may join up with others on the same LAN.


    ```
    cluster.name: some-cluster-name
    discovery.zen.ping.multicast.enabled: false # most cloud services don't allow multicast
    discovery.zen.ping.unicast.hosts: ["some-master"] # add all hosts, masters and/or data nodes
    ```

## Setup HBase

This [tutorial](https://hbase.apache.org/book.html#quickstart_fully_distributed) is the **best guide**, many others produce incorrect results. We are using one host in this guide so no multi-host copying is needed but this setup most closely resembles a clustered setup.

Configure with these changes to `/usr/local/hbase/conf`:

 - **`conf/hbase-site.xml`**

    ```
    <configuration>
        <property>
            <name>hbase.rootdir</name>
            <value>hdfs://some-master:9000/hbase</value>
        </property>
    
        <property>
            <name>hbase.zookeeper.property.dataDir</name>
            <value>hdfs://some-master:9000/zookeeper</value>
        </property>
    
        <property>
            <name>hbase.zookeeper.quorum</name>
            <value>localhost</value>
        </property>
    
        <property>
            <name>hbase.zookeeper.property.clientPort</name>
            <value>2181</value>
        </property>
    </configuration>
    ```

 - **`conf/hbase-env.sh`**

    ```	
    export JAVA_HOME=${JAVA_HOME}
    export HBASE_MANAGES_ZK=true # when you want HBase to manage zookeeper
    ```

   The line with `HBASE_MANAGES_ZK` is super important otherwise you will get Zookeeper errors starting up.

 - **Start HBase**

    ```
    bin/start-hbase.sh
    ```

   At this point you should see several different processes start on the master including zookeeper. If there is an error check the log files referenced in the error message.

## Setup PredictionIO

  {{> build_pio}}


 - **Setup PredictionIO** to connect to the services

   You have PredictionIO in `~/pio` so edit ~/pio/conf/pio-env.sh to have these settings:

    ```
    #!/usr/bin/env bash
    
    # PredictionIO Main Configuration
    #
    # This section controls core behavior of PredictionIO. It is very likely that
    # you need to change these to fit your site.
    
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
    # storage facilities.
    	
    # Storage Repositories
    
    PIO_STORAGE_REPOSITORIES_METADATA_NAME=pio_meta
    PIO_STORAGE_REPOSITORIES_METADATA_SOURCE=ELASTICSEARCH
    
    PIO_STORAGE_REPOSITORIES_EVENTDATA_NAME=pio_event
    PIO_STORAGE_REPOSITORIES_EVENTDATA_SOURCE=HBASE
    
    # Need to use HDFS here instead of LOCALFS to account for future expansion
    PIO_STORAGE_REPOSITORIES_MODELDATA_NAME=pio_model
    PIO_STORAGE_REPOSITORIES_MODELDATA_SOURCE=HDFS
    
    # Storage Data Sources, lower level that repos above, just a simple storage API
    # to use
    
    # Elasticsearch Example
    PIO_STORAGE_SOURCES_ELASTICSEARCH_TYPE=elasticsearch
    PIO_STORAGE_SOURCES_ELASTICSEARCH_HOME=/usr/local/elasticsearch
    # the next line should match the cluster.name in elasticsearch.yml
    PIO_STORAGE_SOURCES_ELASTICSEARCH_CLUSTERNAME=some-cluster-name
    
    # For single host Elasticsearch, may add hosts and ports later
    PIO_STORAGE_SOURCES_ELASTICSEARCH_HOSTS=some-master
    PIO_STORAGE_SOURCES_ELASTICSEARCH_PORTS=9300
    
    # dummy models are stored here so use HDFS in case you later want to
    # expand the Event and PredictionServers
    PIO_STORAGE_SOURCES_HDFS_TYPE=hdfs
    PIO_STORAGE_SOURCES_HDFS_PATH=hdfs://some-master:9000/models
    
    # HBase Source config
    PIO_STORAGE_SOURCES_HBASE_TYPE=hbase
    PIO_STORAGE_SOURCES_HBASE_HOME=/usr/local/hbase
    # Hbase single master config
    PIO_STORAGE_SOURCES_HBASE_HOSTS=some-master
    PIO_STORAGE_SOURCES_HBASE_PORTS=0
    ```

- **Start PIO**: The helper command should run on the master to start Elasticsearch, HBase, and PIO

    ```
    pio-start-all
    pio status
    ```

   The status of all the stores is checked and will be printed but no check is made of the HDFS or Spark services so check them separately by looking at their GUI status pages. They are here:

  - HDFS: http://some-master:50070
  - Spark: http://some-master:8080
 
## 8. Setup Your Template

See the template setup instructions. The Universal Recommender can be installed with its [quickstart](/docs/ur_quickstart). 
