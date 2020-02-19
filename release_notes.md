# Release Notes

## Harness 0.5.1

In production at several locations and in high demand situations. Improvements include:

 - faster requests per second for input and queries
 - new system status CLI
 - new engine status CLI
 - fully deployed now as images using Docker containers and hosted on hub.docker.com.
 - system setup can be done in docker-compose for development or proof of concept
 - the system can be deployed and managed by Kubernetes. 

We maintain a Kubernetes setup config for all Harness services and operate this in high demand situations as well as smaller deployments. This is not free OSS since it is rather complicated to support but comes with many advantages over source or native installations. 

### The Universal Recommender v0.9.0

 - faster queries, higher RPS and greater parallelism.
 - realtime updates to property values in the model. $set properties are written to the model in realtime so changing them does not require a model re-train.
 - uses Elasticsearch v5, 6, or 7, which is the default.
 

### Upgrading

There are no schema changes from 0.5.0 or 0.4.0 but if you upgrade ES to v7 from v5 you will need to re-train any engine that uses it (The Universal Recommender) since the data in ES will be wiped. The data in Mongo may need to be reindexed, which happens automatically but you will need to allow this process to finish before you allow new input or queries.

## Harness 0.5.0

Containerized Harness and all services that it requires.

## Harness 0.4.0

The first production version of Harness with engines for:
 
 - **The Contextual Bandit:** an online learner for a multi-armed bandit that uses contextual information. Based on Vowpal Wabbit online learner.
 - **URNavHinting:** A specialization of the Universal Recommender with input meant for hinting links on a page that the user may prefer&mdash;experimental.
 - **The Universal Recommender:** a mature v0.7.4 version of the UR based on the PredicitonIO code but running in Harness