{{#template name='single_machine'}}
# Single Machine Setup Guide

This is a guide to setting up PredictionIO-aml and the Universal Recommender on a single large memory (32G) machine. This will allow "real data" to be processed but will not focus on horizontal scaling.

#### Other Guides:

 Choose the guide that best fits your needs.

{{> piosmallhaguide}}
{{> piodistributedguide}}

## Requirements

In this guide, all servers share all services, except PredictionIO, which runs only on the master server. Setup of multiple EventServers and PredictionServers is done with load-balancers and is out of the scope of this guide.

Here we'll install and setup:

- Hadoop {{> hdfsversion}}
- Spark {{> sparkversion}}
- Elasticsearch {{> elasticsearchversion}}
- HBase {{> hbaseversion}} due to a bug in 1.1.2 and earlier HBase it is advised you move to {{> pioversion}} installation [instructions here](/docs/pio_quickstart).
- Universal Recommender [here](/docs/ur_quickstart)
- 'Nix server, some instructions below are specific to Ubuntu, a Debian derivative and Mac OS X. Using Windows it is advised that you run a VM with a Linux OS.


## 1. Setup User, SSH, and Host Naming:

1.1 Create user for PredictionIO `aml` in each server

    adduser aml # Give it some password

1.2 Give the `aml` user sudoers permissions and login to the new user. This setup assumes the `aml` user as the **owner of all services** including Spark and Hadoop (HDFS). Do not install or run as `root`!

    sudo nano /etc/sudoers.d/sudo-group
    
Add this line to the file)
    
    # Members of the sudo group may gain root privileges
    # with no password (somewhat controversial)
    %sudo  ALL=(ALL) NOPASSWD:ALL

Then save and add aml user to sudoers
    
    
    sudo usermod -a -G sudo aml
    sudo su aml # or exit and login as the aml user
    cd ~
    sudo service sudo restart # just to be sure permission are all active 

Notice that we are now logged in as the `aml` user and are in the home directory

1.3 Setup passwordless ssh to the current host by creating a public key for the aml user and adding it to `~/.ssh/authorized_keys` and making sure that `known_hosts` includes the current host. There must be no prompt generated when logging in to the current host. **Note:** The importance of this cannot be overstated! If ssh does not connect without requiring a password and without asking for confirmation **nothing else in the guide will work!** It is a requirement of HDFS and therefor HBase.

1.4 Modify `/etc/hosts` file and name each server. Don't use "localhost" or "127.0.0.1" but use either the lan DNS name or static IP address.

    # Use IPs for your hosts.
    10.0.0.1 some-master

## 2. Download Services

Download everything to a temp folder like `/tmp/downloads`, we will later move them to the final destinations.

2.1 Download {{> hdfsdownload}}

2.2 Download {{> sparkdownload}}

2.3 Download {{> esdownload}}

2.4 Download {{> hbasedownload}}

2.5 Clone the ActionML version of PredictionIO from its root repo into `~/pio-aml`

    git clone https://github.com/actionml/PredictionIO.git pio-aml
    cd ~/pio-aml
    git checkout master #get the latest branch

2.6 Clone Universal Recommender Template from its root repo into `~/universal` or do similar for any other template.

    git clone https://github.com/actionml/template-scala-parallel-universal-recommendation.git universal
	cd ~/universal
	git checkout master # or get the tag you want

## 3. Setup Java 1.7 or 1.8

3.1 Install Java OpenJDK or Oracle JDK for Java 7 or 8, the JRE version is not sufficient. Java 7 works for now but to plan ahead we recommend java 8.

    sudo apt-get install openjdk-7-jdk

3.2 Check which versions of Java are installed and pick a 1.7 or greater.

    sudo update-alternatives --config java

3.3 Set JAVA_HOME env var.

Don't include the `/bin` folder in the path. This can be problematic so if you get complaints about JAVA_HOME you may need to change xxx-env.sh depending on which service complains. For instance `hbase-env.sh` has a JAVA_HOME setting so if HBase complains about not finding Java when starting add the following to /etc/environment
 
    export JAVA_HOME=/path/to/open/jdk/jre

## 4. Create Folders:

4.1 Create folders in `/opt`

    mkdir /opt/hadoop
	mkdir /opt/spark
	mkdir /opt/elasticsearch
	mkdir /opt/hbase
	chown aml:aml /opt/hadoop
	chown aml:aml /opt/spark
	chown aml:aml /opt/elasticsearch
	chown aml:aml /opt/hbase

##5. Extract Services

5.1 Inside the `/tmp/downloads` folder, extract all downloaded services.

{{> setsymlinks}}

##6. Setup Services

### 6.1. Setup Hadoop Pseudo-Distributed Mode

Read [this tutorial](http://www.tutorialspoint.com/hadoop/hadoop_enviornment_setup.htm) especially the Pseudo-Distributed Mode. 

- Files config: this  defines the defines where the root of HDFS will be. To write to HDFS you can reference this location, for instance in place of a local path like `file:///home/aml/file` you could read or write `hdfs://some-master:9000/user/aml/file`

  - `etc/hadoop/core-site.xml`

```
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://some-master:9000</value>
    </property>
</configuration>
```

- `etc/hadoop/hadoop/hdfs-site.xml` This sets the actual filesystem location that hadoop will use to save data and how many copies of the data to be kept. In case of storage corruption, hadoop will restore from a replica and eventually restore replicas. If a server goes down, all data on that server will be re-created if you have at a `dfs.replication` of least 2.

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

  - `etc/hadoop/masters` One master for this config.

	```
	some-master
	```

  - `etc/hadoop/slaves` Slaves for HDFS means they have datanodes so the master may also host data with this config

    ```
    some-master
    ```

  - `etc/hadoop/hadoop-env.sh` make sure the following values are set

        export JAVA_HOME=${JAVA_HOME}
        # this has been set for hadoop historically but not sure it is needed anymore
        export HADOOP_OPTS=-Djava.net.preferIPv4Stack=true
        export HADOOP_CONF_DIR=${HADOOP_CONF_DIR:-"/etc/hadoop"}

- Format Namenode

  `bin/hadoop namenode -format`

    This will result actions logged to the terminal, make sure there are no errors

- Start dfs servers only.

  `sbin/start-dfs.sh`

    Do not use `sbin/start-all.sh` because it will needlessly start mapreduce and yarn. These can work together with PredictionIO but for the purposes of this guide they are not needed.

- Create `/hbase` and `/zookeeper` folders under HDFS

  `bin/hdfs dfs -mkdir /hbase /zookeeper`

#### 6.2. Setup Spark Cluster.
- Read and follow [this tutorial](http://spark.apache.org/docs/latest/spark-standalone.html) The primary thing that must be setup is the masters and slaves, which for our purposes will be the same as for hadoop
-  `conf/masters` One master for this config.

    ```
   some-master
    ```

  - `conf/slaves` Slaves for Spark means they are workers so the master be included

    ```
    some-master
    ```

- Start all nodes in the cluster

    `sbin/start-all.sh`

This starts Spark in pseudo-clustered "stand-alone" mode, meaning the driver and one executor will run on `some-master`, which is the current host. It also means the jobs are managed by Spark rather than Yarn or Mesos. This mode most closely resemble how you would set up Spark in a real cluster.

#### 6.3. Setup Elasticsearch Cluster

- Change the `/usr/local/elasticsearch/config/elasticsearch.yml` file as shown below. This is minimal and allows all hosts to act as backup masters in case the acting master goes down. Also all hosts are data/index nodes so can respond to queries and host shards of the index. So even though we are using one machine it most closely resembles a clustered setup.

```
cluster.name: some-cluster # write the same cluster name as in elasticsearch section on pio-env.sh
discovery.zen.ping.multicast.enabled: false # most cloud services don't allow multicast
discovery.zen.ping.unicast.hosts: ["some-master"] # add all hosts, masters and/or data nodes
```

#### 6.4. Setup HBase

This [tutorial](https://hbase.apache.org/book.html#quickstart_fully_distributed) is the **best guide**, many others produce incorrect results. We are using one host in this guide so no multi-host copying is needed but this setup most closely resembles a clustered setup.

6.4.1 Configure with these changes to `/usr/local/hbase/conf`

  - `conf/hbase-site.xml`

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

- `conf/hbase-env.sh`

		export JAVA_HOME=${JAVA_HOME}
		export HBASE_MANAGES_ZK=true # when you want HBase to manage zookeeper

The line with `HBASE_MANAGES_ZK` is super important otherwise you will get Zookeeper errors starting up.

6.4.2 Start HBase

`bin/start-hbase.sh`

At this point you should see several different processes start on the master including zookeeper. If there is an error check the log files referenced in the error message.

##7. Setup PredictionIO

7.1 Build PredictionIO

**Note**: if you have installed in the past see the [upgrade instructions](/docs/install). 

We put PredictionIO in `/home/aml/pio-aml` so change to that location and run

    ./make-distribution

This will create executable jars for PredictionIO-0.9.7-aml

7.2 Setup Path for PIO commands

Add PIO to the path by editing your `~/.bashrc` (linux) or `~/.bash_profile` (Mac OS X). Here is an example of some important values in the file. After changing it remember for execute `source ~/.bashrc` to get the changes into the running shell.

    # Java
	export JAVA_OPTS="-Xmx4g"
    # You may need to experiment with this setting if you get 
    # "out of memory error"" for the driver, executor memory and 
    # Spark settings can be set in the
	# sparkConf section of engine.json

	# Spark
	# this tells PIO which host to use for Spark
	export MASTER=spark://some-master:7077
	export SPARK_HOME=/usr/local/spark

	# pio-aml
	export PATH=$PATH:/usr/local/pio-aml/bin:/usr/local/pio-aml

Run `source ~/.bashrc` to get changes applied.

7.3 Setup PredictionIO to connect to the services

You have PredictionIO in `~/pio-aml` so edit ~/pio-aml/conf/pio-env.sh to have these settings:

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
	PIO_STORAGE_SOURCES_ELASTICSEARCH_CLUSTERNAME=some-cluster

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

Then you should be able to run

    pio-start-all
    pio status

The status of all the stores is checked and will be printed but no check is made of the HDFS or Spark services so check them separately by looking at their GUI status pages. They are here:

 - HDFS: http://some-master:50070
 - Spark: http://some-master:8080

##8. Setup Your Template

See the template setup instructions. The Universal Recommender can be installed with its [quickstart](/docs/ur_quickstart). 

{{/template}}
