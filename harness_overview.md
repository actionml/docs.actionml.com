# Harness Overview

This project implements a REST server for Machine Learning and AI based on a microservice architecture. It provides a REST API for plugin algorithm Engines and implements all services needed for input, query, model update, and dataset management. 

Features include:

 - **Microservice Architecture**: the Application interacts with one REST API, component services are treated as just another microservice, complexities are hidden from the Application.
 - **Single REST API** for ALL input, query, and admin type commands
 - **Flexible Learning Styles**:
    - **Kappa**: Online learners that update models in realtime
    - **Lambda**: Batch learners that update or re-compute models in the background during realtime input and queries.
    - **Hybrids**: The Universal Recommender (UR) is an example of a mostly Lambda Engine that will modify some parts of the model in realtime and will use realtime input to make recommendations but the heavy lifting (big data) part of model building is done in the background.
 - **Compute-Engine Neutral**: supports any compute engine or pre-packaged algorithm library that is JVM compatible. For example Spark, TensorFlow, Vowpal Wabbit, MLlib, Mahout etc. Does not require Spark, or HDFS but supports them with the Harness Toolbox.
 - **Scalability**: to very large datasets via indefinitely scalable compute engines like Spark and databases like MongoDB.
 - **Realtime Input Validation**: Engines supply realtime input validation.
 - **Client Side Support**: SDKs implement support for optional TLS/SSL and Auth and are designed for asynchronous non-blocking use.
     - **Java SDK**: is supplied for Events and Queries REST endpoints 
     - **Python SDK**: implements client side support for all endpoints and is used by the Python CLI.
     - **REST** is simple and can use any HTTP client. TLS and Auth complicate the client but the API is well documented and based on HTTP TLS and Oauth2.
 - **Command Line Interface (CLI)** is implemented as calls to the REST API and so is securely remotable.
 - **Authorization for Secure Multi-tenancy**: runs multiple Engines with separate Permissions
     - **Multiple Engine-IDs**: allow any number of variations on one Engine type or multiple Engine types. One Engine is the simplest case. By default these all run in a single process and so are lightweight.
     - **Multiple Permissions**: allow user+secret level access control to protect one "tenant" from another. Or Auth can be disabled to allow all Engines access without a user+secret for simple deployments.
 - **Mutable Object and Immutable Event Streams**: can coexist in Harness allowing the store to meet the needs of the algorithm.
 - **Data Set Compatibility** with Apache PredictionIO is supported where there is a matching Engine in both systems. For instance `pio export <some-ur-app-id>` produces JSON that can be directly read by the Harness UR via `harness-cli import <some-ur-engine-id> <path-to-pio-export>`. This enables easy upgrades from PredictionIO to Harness.
 - **Async SDKs and Internal APIs**: both our outward facing REST APIs as seen from the SDK and most of our internal APIs including those that communicate with Databases are based on Asynchronous/non-blocking IO.
 - **Provisioning/Deployment** can be done by time proven native installation or using modern container methods:
    - **Containerized** containerized provisioning using Docker and Docker-compose for easy installs or scalable container orchestration
    - **Container Orchestration** [ask us](/#contact) about Kubernetes support.
    - **AWS AMI support** [coming soon](/#contact)

Optional features: 
    
 - **TLS/SSL** support from akka-http on the Server as well as in the Java and Python Client SDKs
 - **Authentication** support using server to server bearer tokens, similar to basic auth but from the OAuth 2.0 spec. Again on both Server and Client SDKs.
 - **Authorization** based on Roles and Permissions for secure multi-tenancy
 - **User and Permission Management**: Built-in user+secret generation with permissions management at the Engine instance level.
    
# Pre-requisites

In its simplest form Harness has few external pre-requisites. To run it on one machine the requirements are:

 - **The Docker host tools** for use with `docker-compose`

OR
 
 - Python 3 for CLI and Harness Python SDK
 - Pip 3 to add the SDK to the Python CLI
 - MongoDB 3.x
 - Some recent `nix OS
 - Services used by the Engine of your choice. For instance the UR requires Elasticsearch

See [Harness Installation](harness_install) for details

