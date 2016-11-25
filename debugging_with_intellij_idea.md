# Debugging with IntelliJ IDEA

It is possible to run your template engine with IntelliJ IDEA. This makes the engine specific commands accessible for debugging, like `pio train`, `pio deploy`, and queries made to a deployed engine.

## Prerequisites

This documentation assumes that you have a fully functional PredictionIO setup. If you have not installed PredictionIO yet, please follow [these instructions](/doc/install).

## Installing IntelliJ Scala Plugin

Once you have install IntelliJ IDEA go to *Preferences->Plugins* pick browse if you don't see one for the Scala language.

![image](/docs/images/scala-plugin.png)

Install and restart IDEA.

## Project Setup

Download the source for your template and import it into IDEA from the startup screen using "Import Project". Pick the directory that contains the code, use SBT do define the project and click through the rest of the default options.

![image](/docs/images/import-project.png)

You will get something like the following screen.

![image](/docs/images/project-screen.png)

PredictionIO Templates put metadata about the template into a store like Elasticsearch (or a DB) and do this when you run `pio build` so you must run this once from the command line after **every** change to `engine.json` or `pio-env.sh` so run `pio build` now.

At this point you have the engine ready to debug.

## A Word About Code Entry Points

PredictionIO commands that start with `pio` have 3 layers:

 1. The pio script, which sets up the env and determines which class to call
 2. The first layer of driver, which sets up internal data structures and can even build, in the case of `pio build`
 3. The final layer is an entry point that creates the command line options for the `spark-submit` script in Spark and invokes it to launch the template code.
 
You will use #3 to debug templates, which is all this tutorial covers. Notice that `pio train`, and `pio deploy` use the spark-submit launcher script, which means these commands depend on having Spark installed and available, which is the case for any standard install.

Since #3 creates some special command line params and env that you must setup for execution starting at layer #3.

## Disappearing Dependency Source

IntelliJ has the annoying tendency to drop some dependencies when you refresh your build.sbt after changes. To avoid this we put any jars that must be available at runtime into a separate empty module in the project then we make the main engine project depend on this dummy module for runtime classes. Otherwise an sbt refresh will cause missing classes errors when trying to do an incremental build.

To solve this right click on the project and click Open Module Settings. In the second modules column hit + and create a new Scala module. Name it `pio-runtime-jars` and add these assemblies under the module dependencies tab and remember to change the scope of the jars to runtime:

 - `predictionio.{{> pioversionnum}}.jar

   This JAR can be found inside the assembly or lib directory of your PredictionIO installation directory in `assembly/`
   
![image](/docs/images/adding-pio.png)

 - spark-assembly-{{> sparkversionnum}}-hadoop2.4.0.jar

   This JAR can be found inside the assembly or lib directory of your Apache Spark installation directory in `lib/`

![image](/docs/images/adding-spark.png)

 - make dependencies scoped to "Runtime"
 
![image](/docs/images/set-to-runtime.png)

 - make your template module depend on the new dummy `pio-runtime-jars` in the "Runtime" scope
 
![image](/docs/images/set-module-dep.png)

## Debugging

To launch the template in the debugger we need to simulate what would happen from the CLI by setting up some debug configurations.

### Simulating `pio train`

 - Create a new Run/Debug Configuration by going to Run > Edit Configurations.... Click on the + button and select Application. Name it `pio train` and put in the following.

```
Main class: io.prediction.workflow.CreateWorkflow
VM options: -Dspark.master=local -Dlog4j.configuration=file:/**replace_with_your_PredictionIO_path**/conf/log4j.properties
Program arguments: --engine-id dummy --engine-version dummy --engine-variant engine.json
```

 - Set the environment to use the correct setting from `conf/pio-env.sh`. For example running everything locally would use the listed env below. Click the ... button to the right of Environment variables, and click the paste button (cmd+v doesn't work) to add below to the debug environment&mdash;remember to replace with your paths.

```	
SPARK_HOME=**replace**/usr/local/spark
ES_CONF_DIR=**replace**/usr/local/elasticsearch/config
HADOOP_CONF_DIR=**replace**/usr/local/hadoop/etc/hadoop
HBASE_CONF_DIR=**replace**/usr/local/hbase/conf
PIO_FS_BASEDIR=**replace**/path/to/home/.pio_store
PIO_FS_ENGINESDIR=$PIO_FS_BASEDIR/engines
PIO_FS_TMPDIR=$PIO_FS_BASEDIR/tmp
PIO_STORAGE_REPOSITORIES_METADATA_NAME=predictionio_metadata
PIO_STORAGE_REPOSITORIES_METADATA_SOURCE=ELASTICSEARCH
PIO_STORAGE_REPOSITORIES_MODELDATA_NAME=pio_
PIO_STORAGE_REPOSITORIES_MODELDATA_SOURCE=LOCALFS
PIO_STORAGE_REPOSITORIES_APPDATA_NAME=predictionio_appdata
PIO_STORAGE_REPOSITORIES_APPDATA_SOURCE=ELASTICSEARCH
PIO_STORAGE_REPOSITORIES_EVENTDATA_NAME=predictionio_eventdata
PIO_STORAGE_REPOSITORIES_EVENTDATA_SOURCE=HBASE
PIO_STORAGE_SOURCES_ELASTICSEARCH_TYPE=elasticsearch
PIO_STORAGE_SOURCES_ELASTICSEARCH_HOSTS=localhost
PIO_STORAGE_SOURCES_ELASTICSEARCH_PORTS=9300
PIO_STORAGE_SOURCES_ELASTICSEARCH_CLUSTERNAME=elasticsearch
PIO_STORAGE_SOURCES_LOCALFS_TYPE=localfs
PIO_STORAGE_SOURCES_LOCALFS_HOSTS=$PIO_FS_BASEDIR/models
PIO_STORAGE_SOURCES_LOCALFS_PORTS=0
PIO_STORAGE_SOURCES_HBASE_TYPE=hbase
PIO_STORAGE_SOURCES_HBASE_HOSTS=0
PIO_STORAGE_SOURCES_HBASE_PORTS=0
PIO_STORAGE_SOURCES_HBASE_HOME=**replace**/usr/local/hbase
```

Replace anything with the word "replace" in the definition.

![image](/docs/images/debug-config.png)

 - 




