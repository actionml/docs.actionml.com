# Introduction to Spark

Spark is a fast in-memory distributed compute engine. By in-memory we mean it does not keep intermediate results in file as with Hadoop's Mapreduce Engine. PredictionIO supports all modes of running Spark including the "Yarn modes". 

The key modes you'll need to understand in the beginning are:

 - **Local**: which uses some number of cores on the local machine splitting them among the "driver" and "executors. To tell Spark to use 4 cores, 1 for the driver and 3 for executors set the command line argument "master=local[4]" Passing Spark command is explained more in the [PredicitonIO cheatsheet](/docs/pio_cli_cheatsheet)
 - **Standalone Cluster**: Somewhat misleading this just means that the Spark Master is scheduling jobs itself and schedules them to run one after the other, sequentially. This is in contrast to using Yarn to set more complex rules for charing a Spark Cluster with Jobs running simultaneously.

It is common to use PredictionIO in local mode to do things like `pio import ...` or `pio export ...`. Standalone Cluster mode is used for training. This is not a rule and so you can choose. Some configuration options will make more sense if we describe the terminology and use with Spark.

**Spark has:**

 - **Master**: a process that coordinates jobs and tasks among Executors.
 - **Worker**: a container for Executors, there is always one Worker per machine instance.
 - **Executor**: an executor of Jobs and Tasks sent to is by the Master. There will be one or more Executors per Worker. 
 - **Driver**: The code written in such a way as to generate a Job with Tasks. PredictionIO's parallel templates often use Spark libraries and create their own closures and functions that are destined for execution by Executors.
 - **Job**: The entire collections of Tasks that a single Driver generates.

Various configuration parameters allow us to control all aspects of how cores, memory, and physical machines are partitioned to match the needs of the algorithm.

## Local Mode Spark

Spark has a great many configuration parameters, by default master=local[n], where n = the number of cores to be allocated will create one process with threads allocated per core in the following manner

![image](https://docs.google.com/drawings/d/1RhCp1Ic7v2eq6zRttvE1vIbNxXol78sSI-Me8aJKSAU/pub?w=1440&h=1080)

### Spark Standalone Cluster Mode

Spark uses a cluster of Workers and a Master for large horizontally distributed calculations. These are still, by default, in-memory but the memory can be spread among Executors in the cluster.

![image](https://docs.google.com/drawings/d/1AUkP-IqVrcwgfx0C1wQ6RVDSZH8LeBGFCpL9tKXs0h4/pub?w=1440&h=1080)


## Spark Parameters

First a note about memory, the most common config and setup question for Spark

 - **Transient Memory**: Spark keeps all intermediate data created during the execution of a Job in memory, there are ways around this but it is the primary speed up vs Hadoop MapReduce. This memory is freed when not needed and is spread among Executors. 
 - **Long-lived Memory**: there may be fixed memory needs for some Jobs. For instance if `hashmaps` are created and used by all Executors, as with the Universal Recommender, then there must be enough memory to hold the `hashmap` on each Executor. Think of this as base requirement on top of which you need to account for transient memory needs. 

There are many ways to tune how Spark runs but with PIO you'll notice these first:
 
 - **Passing Prameters to Spark**: For any command that executes things on Spark (pio import, pio export, pio train, pio deploy - at least pio deploy for non-Universal Recommender templates) you can use a separator "`--`" and follow with parameters passed directly to SparkSubmit. These fill in the SparkConf available to all distributed Spark code and also control how the resources of the cluster are allocated. Using an external machine will imply a standalone clsuter and look like `-- --master=spark://some-ip:7077` All params after the "`--`" will be treated as SparkSubmit params.
 - **`--master=xxxx`**: This tells SparkSubmit where to look for the Master and therefore what type of mode Spark is in. By default in PIO this is `master=local` for local use of all available cores.
 - **`--driver-memory xg`**: This tells Spark to give "x" gigabytes of memory to the Driver, since it is passed to SparkSubmit it only affects the part of the driver controlled by Spark. In rare cases you may need to give more memory to the JVM to launch the driver so this is not covered here.
 - **`--executor-memory xg`**: This tells Spark to give "x" gigabytes of memory to the Executor. In a clustered setting where an entire machine is dedicated to being a Worker with one Executor you would want to give almost all memory, leaving only enough for the OS to run. When running on a single machine great care should be taken to not over allocate memory for Driver and Executors or you will over-constrain the machine allocating more memory than you have, causing constant crashes with some form of an out-of-memory exception.

## Caveates

Spark is fast but gobbles memory so don't scrimp and be careful running driver and executor on the same machine, which will need roughly double the memory of running them on 2 different machines. 

In-memory but distributed computation means that (all other things being equal) if you have 1 TB of data, then the cluster as a whole may need 1TB of memory.