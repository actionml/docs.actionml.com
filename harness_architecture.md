# Architecture

At its core Harness is a fast lightweight Server that supplies a REST API and manages Engines. It provides a Toolbox of scalable services that Engines can use. Engines can be used together or as a single solution. 

![Harness with Multiple Engines](https://docs.google.com/drawings/d/e/2PACX-1vTsEtxnVUKnZ6UCoQd9CE7ZSKXqp59Uf9fEtkXJZKtXPFZ1kRrYDnFC-K1y46HTLl5uvXXA-pCZ-ZED/pub?w=1250&h=818)

## Harness Core

Harness is a REST server with an API for Engines, Events, Queries, Jobs, Users, and Permissions. Events and Queries end-points handle input and queries to Engine instances. The rest of the API is used for administrative functions and is generally accessed through the CLI called `harness-cli`.

The Harness Server core is small and fast and so is appropriate in single Algorithm solutions&mdash;an instance of The Universal Recommender is a good example. By adding the Harness Auth-server and scalable Engine backend services Harness can also become a full featured multi-tenant SaaS System.  

## Router

The Harness core is made from a component called a Router, which maintains REST endpoints for the various object collections. It routes all requests and responses to/from Engine Instances. It also supports optional SSL, OAuth2 signature based authentication, and REST route based authorization.

Algorithm specific Engines can be implemented without the need to deal REST APIs. Engines start by plugging into the abstract Engine API and inherit all server features including administration, input, and query APIs.

## Administrator

The Administrator manages Engine Instances (and optionally Users and Permissions).

## Engines

An Engine is the implementation of a particular algorithm. Each Engine is instantiated to manage one or more datasets and one or more models.

The common things about all Engines:

 - **input** is received as JSON "events" from REST POST requests.
 - **queries** are JSON from REST POST requests.
 - **query results** are returned in the response for the request and is defined by the Engine type.
 - **JSON configuration files** define Engine Instance parameters including generic Engine settings as well as Algorithm params. See the Engine docs for Algorithm params and Harness docs for generic Engine params.

## Scaling

Harness is a stateless service. It does very little work itself. It delegates most work to the Engines and other Services that is depends on. These services are all best-in-class made to scale from a single machine to massive clusters seamlessly. Harness provides a toolbox of these scalable services that can be used by Engines for state, datasets, and computing.

Harness is scaled by scaling the services it and the various Engines use. For example The Universal Recommender will scale by using more or larger nodes for training (Spark), input storage (MongoDB), and models (Elasticsearch). In this manner Harness can be scaled either horizontally (for high availability) or vertically (for cost savings) to supply virtually unlimited resources to an Engine Instance.

## Compute Engines

The use of scalable Compute Engines allow Big Data to be used in Algorithms. For instance one common Compute Engine is Apache Spark, which along with the Hadoop Distributed File System (HDFS) form a massively scalable platform. Spark and HDFS support are provided in the Harness Toolbox.

# Flexible Learning Styles

 -  **Lambda (Batch Offline)**: Many algorithms learn by processing a large batch of data and updating their model periodically. The [Universal Recommender (UR)](h_workflow) is an example of a Lambda learner. Spark's MLlib also has examples of Lambda style learners. 

 - **Kappa (Streaming Online)**: The Kappa style learning algorithm take in unbounded streams of data and incrementally updates the model without the need for a background batch operation. See the discussion of how this works in Harness Templates in [Kappa Learning](h_kappa_learning.md)

 -  **Hybrid Learning**: The [Universal Recommender (UR)](docs/h_ur.md) is an example of a hybrid learner. It calculates the largest part of its model in the background using Apache Spark and Mahout. This model can itself be modified in realtime for some types of input. The UR is also able to use realtime user behavior to make personalized recommendations. 
 
# Server REST API

Harness REST is optionally secured by TLS and Authentication. This requires extensions to the typical REST API to support authentication control objects like Users and Roles, here we ignore these for simplicity. 

Integral to REST is the notion of a "resource", which is an item that can be addressed by a resource-id. POSTing to a resource type creates a single resource. The resource types defined in Harness are:

 - **engines**: the engine is the instance of a Template, with associated knowledge of dataset, parameters, algorithms, models and all needed knowledge to Learn from the dataset to produce a model that will allow the engine to respond to queries. 
     - **events**: sub-collections that make up a particular dataset used a specific Engine. To send data to an Engine simply `POST /engines/<engine-id>/events/` a JSON Event whose format is defined by the Engine. Non-reserved events (no $ in the name) can be thought of as a unending stream. Reserved events like `$set` may cause properties of mutable objects to be changed immediately upon being received and may even alter properties of the model. See the Engine description for how events are formatted, validated, and processed. 
     - **queries**: queries are created so engines can return information based on their models. See the Engine documentation for their formats.
     - **jobs**: creates a long lived task such as a training task for a Lambda Engine.

For the full Harness REST API and response codes, see the [Harness REST Specification](h_rest_spec.md)

## Clients and Client SDKs

Harness has a client for administration of the Server called harness-cli. It uses the REST API and so can be run remote of the Server. It is based on the Python client SDK.

Both the Python SDK and the Java/Scala SDK as well as HTTP(S) REST, can also be used to send input and make queries, a subset of the full REST API that is sufficient for Apps that use Harness.

 - **The Python SDK**: implements the entire client side REST APIs including all input/query, security related embellishments, and admin APIs. The Python SDK is used to implement the [Harness Admin Client](https://github.com/actionml/harness-cli) `harness-cli` and is part of that project.
 - **The Java and Scala SDK**: implements the needed REST client for input and queries but not admin. It can be found [here](https://github.com/actionml/harness-java-sdk).
 - **HTTP(S) REST**: the Harness server can be accessed via REST also. See the [REST API](h_rest_api) docs.

## Input and Query Overview

Disregarding the optional TLS and Auth, simple input for the UR look like:

```
curl -H "Content-Type: application/json" -d '
{
   "event" : "buy",
   "entityType" : "user",
   "entityId" : "John Doe",
   "targetEntityType" : "item",
   "targetEntityId" : "iPad",
   "eventTime" : "2019-02-17T21:02:49.228Z"
}' http://localhost:9090/engines/<some-engine-id>/events
```

queries look like:

``` 
curl -H "Content-Type: application/json" -d '
{
  "user": "John Doe"
}' http://localhost:9090/engines/<some-engine-id>/queries
```    

The result of the query will be in the JSON response body for the query and looks like this:

```
{
    "result":[
        {"item":"Pixel Slate","score":1.4384104013442993},
        {"item":"Surface Pro","score":0.28768208622932434}
    ]
}
```

For specifics of the format and use of input and queries see the Engine specific documentation&mdash;for example [The Universal Recommender](docs/h_ur.md). 
