{{#template name='pio_architecture'}}
# Architecture

PredictionIO is a Framework for Machine Learning. It provides an API for creating "templates", which implement a particular ML algorithm like a recommender of classification. It also provides services that flesh out what is known as a lambda architecture. It is primarily build on Spark but not limited to the algorithms that are supplied with Spark.

## Lambda in PredictionIO
![image](/docs/images/pio-architecture.png)

This translates to realtime input and queries&mdash;with background re-calculation of models. This even allows realtime data to be used in returning queries so templates like the Universal Recommender can use realtime user history to return personalized recommendations.

## PredictionIO Component Services

It is important to note that PIO does not store state outside of it's component services, which are all highly scalable and cluster-aware. This means that to scale PIO most of what you must do is scale its component services. These are:

 - **HBase**: a NoSQL database that has proven stable, performant, and scalable. One of its dependencies is Hadoop's distributed file system (HDFS)
 - **HDFS**: implements a scalable redundant file system for sharing data between nodes of a cluster and is used by execution engines like Spark.
 - **Spark**: is the most high performance execution engine running on the HDFS infrastructure. It uses internal (mostly) in-memory data structures to get something like 10x better performance than Hadoop's own Mapreduce.
 - **Elasticsearch**: provides fast clusterable indexed storage and a K-Nearest Neighbors (KNN) engine for PIO internal metadata and algorithm usage.

## Architecture and Data Flow

The internal architecture of PredictionIO and the data flow for **all** use modes is shown below.

![image](https://docs.google.com/drawings/d/1Uz2STgGUiBh_7Lv9iWB2EtEyiQta4ySegCevbbr-xR0/pub?w=960&h=720)

To Illustrate how this flow changes we'll look at each stage separately, they are:

- Event input to the EventServer
- Training a model
- Queries to a PredictionServer
- Bootstrap importing batch data and exporting backups

###Live Event Input


{{/template}}