# Harness Config

The Harness configuration is global for operating generic non-engine specific operations but are also available to the Engines if resources are needed. Practically speaking Harness config is separate from Engine Instance config, which needs parameters specific to single algorithms. 

 - **Harness Server Configuration**: Defines server settings, how it connects to other services or to applications, security, and other server specific settings. These settings are collected in `harness-env` in the form of environment variables.
 - **Engine Instance Configiration**: Defines a set of *generic* parameters that are available to all Engine Instances via their JSON config files. These include method and location of event mirroring, model storage, factory object name, and other parameters that apply to a specific engine instance but is available to all engines. 

## Harness Server Config

Harness server settings are in `bin/harness-env.sh` where Harness is installed as shown below. The default setup is for localhost connections, no Auth or TLS. This is good for running everything on a dev machine for experiments.

```
# Harness Server config

# deprecated old REST_SERVER_HOST/PORT config used in Harness 0.4.x
# export HARNESS_URI="http://0.0.0.0:9090" # for external connections
export HARNESS_URI="${HARNESS_URI:-http://localhost:9090}"

# To configure Harness logging
export HARNESS_LOG_CONFIG="${HARNESS_HOME}/conf/logback.xml"
export HARNESS_LOG_PATH="${HARNESS_LOG_PATH:-$HARNESS_HOME/logs}"

# MongoDB setup
export MONGO_URI="${MONGO_URI:-mongodb://localhost:27017}"

# Elasticsearch setup (optional: used by UR and similar Engines)
# todo: need to allow for multiple servers for cluster operation of ES
export ELASTICSEARCH_URI="${ELASTICSEARCH_URI:-http://localhost:9200}"

# This setting helps mark spark train jobs as expired if they do not respond for this period of time
export JOBS_EXPIRE_AFTER="12 hours"

# Use only when necessary to pass options to the launcher for Harness
# for example below we set the heap size for the JVM, otherwise the JVM has a default, which is correct in many cases
# also in the example we use a more concurrent Garbage Collector, to avoid pauses in Harness execution for GC
# HARNESS_OPTS=" -J-Xmx4G -J-XX:+UseConcMarkSweepGC "


# ======== FOR SIMPLE USE CASES LOOK NO FURTHER ===============

# The maximum number of concurrently accepted connections.
# Note, that this setting limits the number of the connections on a best-effort basis.
# It does *not* strictly guarantee that the number of established TCP connections will never
# exceed the limit (but it will be approximately correct) because connection termination happens
# asynchronously. It also does *not* guarantee that the number of concurrently active handler
# flow materializations will never exceed the limit for the reason that it is impossible to reliably
# detect when a materialization has ended.
# See akka.http.server.max-connections at https://doc.akka.io/docs/akka-http/current/configuration.html
export HARNESS_MAX_CONNECTIONS=${HARNESS_MAX_CONNECTIONS:-1024}

# The maximum number of requests that are accepted (and dispatched to
# the application) on one single connection before the first request
# has to be completed.
# Incoming requests that would cause the pipelining limit to be exceeded
# are not read from the connections socket so as to build up "back-pressure"
# to the client via TCP flow control.
# A setting of 1 disables HTTP pipelining, since only one request per
# connection can be "open" (i.e. being processed by the application) at any
# time. Set to higher values to enable HTTP pipelining.
# This value must be > 0 and <= 1024.
# See akka.http.server.pipelining-limit at https://doc.akka.io/docs/akka-http/current/configuration.html
export HARNESS_MAX_REQUESTS=${HARNESS_MAX_REQUESTS:-16}

# HDFS setup
# export HADOOP_CONF_DIR=${HADOOP_CONF_DIR:-"/etc/hadoop"}
# Files can be addressed as hdfs://<some-name-node>:9000 by default but change the master and port below
# if needed
# export HDFS_MASTER=${HDFS_MASTER:-localhost}
# export HDFS_MASTER_PORT=${HDFS_MASTER_PORT:-9000}

# =============================================================
# Only change to enable TLS/SSL
# =============================================================

# export HARNESS_SSL_ENABLED=true # to enable TLS/SSL using the rest below for "localhost" keys passwords and certs
export HARNESS_SSL_ENABLED=${HARNESS_SSL_ENABLED:-false}

# Harness TLS/SSL server support. A file needs to be provided even if TLS is not used, one is supplied for "localhost"
export HARNESS_KEYSTORE_PASSWORD=${HARNESS_KEYSTORE_PASSWORD:-changeit}
export HARNESS_KEYSTORE_PATH=${HARNESS_KEYSTORE_PATH:-$HARNESS_HOME/conf/harness.jks}

# Java and Python client SDKs use the following for TLS/SSL, not used by the server
# the file provided works with localhost, create your own for some other IP address
export HARNESS_SERVER_CERT_PATH=${HARNESS_SERVER_CERT_PATH:-$HARNESS_HOME/conf/harness.pem}

# The Python CLI must connect to the external address of the server to use TLS, supply it here
# export HARNESS_EXTERNAL_ADDRESS=0.0.0.0 # address to listen on, 0.0.0.0 is typical for external connections
export HARNESS_EXTERNAL_ADDRESS=${HARNESS_EXTERNAL_ADDRESS:-localhost}


# =============================================================
# Only used for Authentication
# =============================================================

# Harness Auth-Server setup
# export HARNESS_AUTH_ENABLED=true
export HARNESS_AUTH_ENABLED=${HARNESS_AUTH_ENABLED:-false}
export HARNESS_AUTH_URL=${HARNESS_AUTH_URL:-http://localhost:9099}
# When auth is enabled there must be an admin user-id set so create one before turning on Auth
# Both the Harness server and the Python CLI need this env var when using Auth
export ADMIN_USER_ID=${ADMIN_USER_ID:-some-user-id}
# The Python CLI needs to pass the user-id and user-secret to the Python SDK so when using Auth supply a pointer to
# the user-secret here.
export ADMIN_USER_SECRET_LOCATION=${ADMIN_USER_SECRET_LOCATION:-"$HOME/.ssh/${ADMIN_USER_ID}.secret"}

# Spark Job Server setup
export SPARK_JOB_SERVER_URL=${SPARK_JOB_SERVER_URL:-http://localhost:8998}
```

## Security

See [Secrity](security.md) Auth and TLS/SSL.

## Remote Connections

By default Harness listens on `http://localhost:9090` To have harness listen for connections from outside change the appropriate settings, most importantly:

```
export HARNESS_URI="http://0.0.0.0:9090" # for external connections
```

## Harness Common Engine Instance Parameters

Harness provides default behavior for all engines. These can be changed on a per-engine-instance basis in the engine instance's config. Shared/common settings are:

```
"engineId": "test_scaffold_resource",
"engineFactory": "com.actionml.engines.scaffold.ScaffoldEngine",
"mirrorType": "localfs" | "hdfs",
"mirrorContainer": "< directory for storage of mirrored events >",
"modelContainer": "< directory for storage of models >",
"algorithm": {
  ...
}
```

 - **engineId**: This is a URL encoded REST resource id for the engine instance. It is therefore the "address" by which it is know to the REST API. No default: required.

 - **engineFactory**: The fully qualified classname which contains a factory method named `apply` which takes this JSON file as the input parameter and responds with an HTTP status code and explanation body. No default, required.

 - **mirrorType**: `localfs` or `hdfs` are supported as of Harness 0.3.0. In the future other possible stores include Kafka topics may be supported. Default: no mirroring, not required. The presence of this and the `mirrorContainer` turns on mirroring. **Beware**: The `mirrorType` also defines the type of storage for the `harness import ...` command so the imported files must be in `localfs` or `hdfs` as specified here. This is to make re-importing of mirrored events easier but you cannot import from the `mirrorContainer` directly since this could cause an infinite loop. See the `harness import ...` command under [Commands](commands.md) Optional, no default.
 
 - **mirrorContainer**: A descriptor for the location of mirroring for this engine instance. This should be a directory or other container, not a file name. If using localfs or HDFS a subdirectory will be created with the engine-id as a name and files will accumulate labeled for each day of mirroring. No default: not required. The presence of this and the `mirrorType` turns on mirroring.  Optional, no default.

    Local filesystem example:
    
    ```
    "mirrorType": "localfs",
    "mirrorContainer": "/home/aml/mirrors",
    ```
    
    HDFS example:
    
    ```
    "mirrorType": "hdfs",
    "mirrorContainer": "hdfs://your-hdfs-server:9000/mirrors"
    ```
    
    These containers must exist before mirroring will be done. The port should correspond to the one used by HDFS, which by default is usually `9000`.
    
 - **modelContainer**: A descriptor for the location the engine instance may use to keep the persistent form of any model needed by the instance. This may be a localfs directory or some id required by the Engine. Typically this is a directory, which will have a model named for each engine-id. Optional, defaults to the root of Harness.

 - **algorithm**: The parameters control the operation of the Algorithm and so are specified in the Engine documents.

 - **some-other-sections**: for instance there may be a section describing Spark params called `sparkConf`. Arbitrary sections can be added to pass Engine specific information. The information should be considered immutable. It takes a `harness update <some-engine-json-file>` to update it. See specific Engine docs for more information about what can be modified.