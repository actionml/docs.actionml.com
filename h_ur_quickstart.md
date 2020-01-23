# UR Quickstart

If you have installed Harness (for a fast installation try the ["one-liner" here](harness_container_guide)), you already have the UR. 

# Creating an Engine Instance for the UR

In order to send input, import, get status, or query an 
Engine Instance you must first create one. An Engine Instance is created from some Engine type (like the UR) with a JSON configure file. 

To create the instance use the Admin command:

```harness-cli add /path/to/engine/config/json```

The JSON file contains parameters for the UREngine like algorithm parameters but also some required things that allow Harness to route the input Events to the correct Engine Instance. 

The required part of the UR JSON looks like this:

```
{
    "engineId": "<some_engine_id>",
    "engineFactory": "com.actionml.engines.ur.UREngine",
    "sparkConf": {
        "spark.serializer": "org.apache.spark.serializer.KryoSerializer",
        "spark.kryo.registrator": "org.apache.mahout.sparkbindings.io.MahoutKryoRegistrator",
        "spark.kryo.referenceTracking": "false",
        "spark.kryoserializer.buffer": "300m",
        "spark.executor.memory": "<3g>",
        "spark.driver.memory": "<3g>",
        "spark.es.index.auto.create": "true",
        "spark.es.nodes": "elasticsearch",
        "spark.es.nodes.wan.only": "true"
    },
    "algorithm":{
        "indicators": [ 
            {
                "name": "<buy>"
            },{
                "name": "<detail-page-view>"
            }
        ],
    }
}
```

Replace all <param> settings with yours.

 - **`engineId`**: This is the resource ID, in the REST sense. It is used in a URI (Universal Resource Identifier) to address the specific Engine Instance for any REST API&mdash;including input Events and Queries.
 - **engineFactory**: this is the full class name of the "factory" that can instantiate the Engine Instance with the rest of the parameters.
 - **sparkConf**: This contains parameters for the Spark driven training that creates a UR model from accumulated input. The key settings are:
     - **spark.es.nodes**: set to the address used from inside the harness process. If using containers this will be the Elasticsearch container name, otherwise it will be an IP address or DNS name for the Elasticsearch data node(s).
     - **spark.executor.memory** or **spark.driver.memory**: These control how much memory is allocated to the training job's "Driver" and "Executors". These settings are loosely connected to the size of the input data. If running on a single host these are additive, the host must have enough memory to allocate for both Driver and Executor. For a cluster configuration the Driver runs inside the Harness process and there will be an executor per Spark Worker node. 
 - **algorithm**: Some `algorithm` params are required. 
     - **indicators**: This is an array of names used in events sent as input. At least one is required. Substitute indicator names that are mnemonics for how the data is gathered. Think of these as data from some user action&mdash;conversions like "buy", "watch", or "read" or non-conversion actions like "search-term", "detail-page-view", or "category-preference". Start simple, you can always add data later. The first indicator in this array is used as the "primary indicator" and corresponds to the conversion action, for example in ECom this is a "buy".

There are many other parameters that control various optional features of the UR, see [UR Config](h_ur_config) for details.

# Input

From the Engine Instance config we know a unique ID for the instance. We can now combine it with other information to create a URI to use in sending input. The actual input payload will be JSON in a format defined by the Engine type (UR for example)

For the UR input (as an Example) you can use `curl` to send input like this:

```
$ curl -i -X POST http://<harness-address:9090>/engines/<some_engine_id>/events \
-H "Content-Type: application/json" \
-d '{
   "event" : "buy",
   "entityType" : "user",
   "entityId" : "John Doe",
   "targetEntityType" : "item",
   "targetEntityId" : "iPad",
   "eventTime" : "2015-10-05T21:02:49.228Z"
}
```

Notice the use of the `events` endpoint with an `engineId` as the REST resource id. The URI derived from these is:

```http://<harness-address:9090>/engines/<some_engine_id>/events```

An HTTP/HTTPS 201 "resource created" response means the Event was created as an input datum. If it is invalid you will get some error like 400 "bad request" meaning the event may have been malformed or was invalid.

For a more detailed explanation see [UR Input](h_ur_input)

# Train

After input but before queries, the UR must update its model. The model is a special object created from input to make queries operate in realtime even though the data may be very large. The UR uses Apache Spark to calculate a model update and this is triggered by `harness-cli train <some_engine_id>`. Alternatively the train operation is also possible using a REST endpoint to trigger.

```
$ curl -i -X POST http://<harness-address:9090>/engines/<some_engine_id>/jobs \
-H "Content-Type: application/json" \
-d '{}
```

Notice the use of the `jobs` endpoint. A training "job" may take a long time to complete. This depends on data size and the amount of resources allocated to Spark for execution. Once it has completed without error, queries can be made (see [Workflow](h_workflow)).

# Query

Forming a Query is much like forming an input event. We need the address of the Harness server and the `engineId` value from the JSON config.

The Query payload is in the JSON request body. A simple example for the UR is:

```
$ curl -i -X POST http://<harness-address:9090>/engines/<some_engine_id>/queries \
-H "Content-Type: application/json" \
-d '{
  "user": "John Doe"
}
```

Notice the use of the `queries` endpoint.

For a more detailed description see [UR Queries](h_ur_queries).

# Summary

In the examples below we send input and queries to the a UR Engine Instance. Replace angle bracket `<text>` with your information.

 - **Input**: 

    ```
    POST: 
      http://<harness-address:9090>/engines/<some_engine_id>/events
    JSON BODY: 
      {
        "event" : "buy",
        "entityType" : "user",
        "entityId" : "John Doe",
        "targetEntityType" : "item",
        "targetEntityId" : "iPad",
        "eventTime" : "2015-10-05T21:02:49.228Z"
      }
    ```

 - **Query**:

    ```
    POST: 
      http://<harness-address:9090>/engines/<some_engine_id>/queries
    JSON BODY: 
      {
        "user": "John Doe"
      }
    ```

# Workflow

Input and Queries happen whenever demanded by the Application. For instance when a product detail page is displayed, item-based recommendations may be displayed, therefore the display should trigger an item-based query. It will also trigger an input event for "detail-page-view" and so on. 

However a background operation is required to keep the UR model up-to-date. This is an administration type operation that can be scheduled independent of input and query. The operation is:

```harness-cli train <some_engine_id>```

Which can alternatively be triggered through its REST endpoint 

For a more detailed description see [Workflow](workflow).

