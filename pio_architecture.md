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

![image](https://docs.google.com/drawings/d/1rs052NQsrLGiPeJfXAwJ0RmG_2a3Mi5ut7u3kCSXDsU/pub?w=960&h=720)

To Illustrate how this flow changes we'll look at each stage separately, they are:

- Event input to the EventServer
- Training a model
- Queries to a PredictionServer
- Bootstrap importing batch data and exporting backups

###Live Event Input

This is the typical input mode of the system where clients or web app backends are feeding new data to the running system. This data is used by the templates (including The Universal Recommender) in realtime though it requires a `pio train` to reflect new items or property changes. For the case where new users are sending new events, the template will be able to create results in realtime that use the new user data.

![image](https://docs.google.com/drawings/d/1S4GDPsVMVBhN2UxdnEXd2xuNBxyltPiwdE6abSmx9WA/pub?w=960&h=720)

###Training a Model

In Data-Science jargon the template creates a new model from the EventServer's data taken as a whole every time `pio train` is called. This is the background part of the Lambda Architecture. As a rule of thumb it's best to re-train when enough new data has come in to require retraining&mdash;for a recommender this is when new items with interactions exist since a recommender cannot recommend items that is hasn't seem in training data.

For the UR a background batch operation is performed and, when it's done, the new model is available to PredictionServers. So no re-deployment is necessary to update a running UR but other templates may require it.

![image](https://docs.google.com/drawings/d/1p5Y_3DiIuoq0OnLFY581yJz5oW006Pw8XwSJSM-k_10/pub?w=960&h=720)

###Queries

Once we have trained the template and stored a model, queries will produce results. Most templates have their own method for generating results with their own requirements. The example below is for the Universal Recommender, which uses Elasticsearch in the query phase.

For the UR each query from the client application results in 2 internal queries one to the EventServer to get user history events, and one to Elasticsearch that is created from the user history and the client app query. So if a query only passes in a user-id, the user history is retrieved from the EventServer and this forms most of Elasticsearch query. Only one query is made to Elasticsearch with all params needed. Once Elasticsearch returns items they are passed back to the client application.

![image](https://docs.google.com/drawings/d/1gRCRR7QLunO5EjvJwhSLYuZA0ugyPqHmfACzpgHueCw/pub?w=960&h=720)

###Bootstrapping Batch Import

On-boarding new data can be accomplished by creating json event files. These are a form of json that is directly supported by Spark. Each event is encoded in a json object&mdash;one per line. Normally json would require this to be in an array but Spark requires that each line contain the object so lines can be read in parallel. The json can be created of the same form that is exported from the EventServer as a backup. 

If you have used one of the Universal Recommender integration tests like `examples/integration-test` you will have example data in the EventServer. For other templates if you have data in the EventStore issue a `pio export ...` command to see the format. You don't have to create the event id or `creationDate` but you should create the `eventDate` if possible. See the template documentation for exact data require for input.

Alternatively you can use an SDK or the REST API to send events to the running EventServer, just as you would with the live event stream in production. In this case the Events do not come from files.

![image](https://docs.google.com/drawings/d/1WakBT5yCw_QUtodZJj9Tv04qN6MNe6D4LD1A-AaLDBk/pub?w=960&h=720)


{{/template}}