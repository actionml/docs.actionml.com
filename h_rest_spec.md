# The Harness REST Specification

REST stands for [REpresentational State Transfer](https://en.wikipedia.org/wiki/Representational_state_transfer) and is a method for identifying resources and operations to be preformed on them. By combining the HTTP verb with a URI most desired operations can be constructed. 

# Harness REST

From the outside Harness looks like a single server that fields all REST APIs, but behind this are serval more heavy-weight services (like databases or compute engines). In cases where Harness needs to define a service we use a ***microservices*** architecture, meaning the service is itself invoked via theiir own service APIs to encapsulates some clear function, like the Harness Auth-server. All of these microservices are invisible to the outside and used only by Harness although they may be accessed for troubleshooting.

The Harness CLI (`hctl`) is implemented in Python as calls to the Harness REST API. See [Commands](h_commands.md) for more about the CLI. 

All input, query, and admin operations are implemented through the REST API. The client application may use one of the provided client SDKs or may use HTTP directly.

# Harness HTTP Response Codes
<table>
    <tr>
        <th>HTTP Verb</th>
        <th>Resource Type</th>
        <th>CRUD Operation</th>
        <th>HTTP Code</th>
        <th>Meaning</th>
    </tr>
    <tr>
        <td>POST</td>
        <td>Collection</td>
        <td>Create</td>
        <td>201</td>
        <td>resource created</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>Collection</td>
        <td>Create</td>
        <td>202</td>
        <td>a task is accepted for creation</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>Collection</td>
        <td>Create</td>
        <td>400</td>
        <td>bad request</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>Item</td>
        <td>Create</td>
        <td>201</td>
        <td>resource created</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>Item</td>
        <td>Update</td>
        <td>200</td>
        <td>resource updated, via param</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>Item</td>
        <td>Create</td>
        <td>404</td>
        <td>resource not found</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>Item</td>
        <td>Create</td>
        <td>409</td>
        <td>resource conflict (this is generally allowed by re-defining the resource and so returns 201)</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>Collection or Item</td>
        <td>Read</td>
        <td>200</td>
        <td>resource found and returned</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>Collection or Item</td>
        <td>Read</td>
        <td>404</td>
        <td>resource not found or invalid</td>
    </tr>
    <tr>
        <td>PUT</td>
        <td>Collection or Item</td>
        <td>Update</td>
        <td>405</td>
        <td>resources are created with POST, which may modify also so PUT is not used</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>Collection or Item</td>
        <td>Delete</td>
        <td>200</td>
        <td>resource deleted</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>Collection or Item</td>
        <td>Delete</td>
        <td>404</td>
        <td>resource not found or invalid</td>
    </tr>
    <tr>
        <td>All</td>
        <td>Collection or Item</td>
        <td>All</td>
        <td>401</td>
        <td>unauthorized request, authroization failure</td>
    </tr>
    <tr>
        <td>All</td>
        <td>Collection or Item</td>
        <td>All</td>
        <td>403</td>
        <td>forbidden request/authroization failure</td>
    </tr>
    <tr>
        <td>All</td>
        <td>Collection or Item</td>
        <td>All</td>
        <td>405</td>
        <td>method not allowed</td>
    </tr>
</table>    

# JSON 

Harness uses JSON for all request and response bodies. The format of these bodies are under the control of the Specific Engines with some information layered on by Harness itself.

See the Engine docs for request/response content and formats.

# Harness REST Resource Types

Harness REST resources may own sub-resources as shown.

![](https://docs.google.com/drawings/d/e/2PACX-1vToTQAtggzYIupQMN6emdlKyqmtXSv1DSM-ZMl2hiAxzxLNAXy3vXCSDrnGoWYZD_YXr2DOc6GIQ6Tg/pub?w=915&h=1007)

All resources are either ephemeral or stored in a persistence service like a DB. Harness itself is stateless, storing nothing.

 - **System**: Contains system config information. Starting with Harness 1.0 all nodes of Harness in a multi-node setup are known via their status kept in etcd. The System object has information about all nodes and their internal status.

 - **Engines**: Each Engine Instance has defining configuration JSON in some file. This config must contain an `engineId` which is used throughout the REST API. There are other generic params defined in [Harness Config](harness_config.md) but many are Engine specific Algorithm parameters, which are defined by the Engine (the [Universal Recommender](h_ur_config.md) for instance)

 - **Events**: Events encapsulate all input to Engines and are defined by the Engine (the [Universal Recommender](h_ur_input.md) for example).

 - **Queries**: Queries encapsulate all queries to Engines and are defined by the Engine (the [Universal Recommender](h_ur_queries.md) for example).

 - **Jobs**: A Job is created to perform some task that may be long lived. For instance to train an Engine Instance may take hours. In this case the request creates the job and returns the job-id but this does not mean it is finished. Further status queries for the Engine Instance will report Job status(es)

    For example POST `/engines/<some-ur-instance>/jobs` will cause the Universal Recommender to queue up a training Job to be executed on Spark. This POST will have a response with a job-id. This can be used to monitor progress by successive GET `/engines/<some-ur-instance>`, which return job-ids and their status. If it is necessary to abort or cancel a job, just execute DELETE `/engines/<some-ur-instance/jobs/<some-job-id>`. These are more easily performed using harness-cli.

 - **Users**: Users are only relevant if using the Auth-server Harness extension and can be created with the roles of "client" or "admin". Client Users have CRU access to one or more Engine Instance (only an admin can delete). An admin User has access to all resources and all CRUD. Users are only needed when using the Auth-server's Authentication and Authorization to control access to resources.

# REST API

<table>
    <tr>
        <th>HTTP Verb</th>
        <th>URL</th>
        <th>Request Body</th>
        <th>Response Code</th>
        <th>Response Body</th>
        <th>Function</th>
    </tr>
    <tr>
        <td>GET</td>
        <td>/</td>
        <td>none</td>
        <td>See Collection responses</td>
        <td>"OK"</td>
        <td>Used for liveness check only, i.e Kubernetes</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/system</td>
        <td>none</td>
        <td>See Collection responses</td>
        <td>JSON describing system config (<1.0) or cluster connection status (1.0+)</td>
        <td>Describes system status</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/engines/</td>
        <td>JSON Engine config</td>
        <td>See Collection responses</td>
        <td>Engine description</td>
        <td>Defines an Engine with a resource-id in the Request Body config, uses Harness and Engine specific config and parameters. See Config for Harness settings, and the Template for Engine params. Optionally depending on the JSON some Engine parts may be modified in place such as Algorithm params modified</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/engines/</td>
        <td>none</td>
        <td>See Collection responses</td>
        <td>Engine descriptions for Engines the user has Read access to</td>
        <td>This works like a list command to show all resources the user can read. For the Admin this would show all Engines in the system</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/engines/&lt;some-engine-id&gt;</td>
        <td>JSON Engine config</td>
        <td>See Item responses</td>
        <td>hint about how to know what was changed</td>
        <td>Modify any params that the Engine allows</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>/engines/&lt;some-engine-id&gt;</td>
        <td>none</td>
        <td>See Item responses</td>
        <td>none</td>
        <td>Remove and destroy all sub-resources (data and model) and config for the Engine</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/engines/&lt;some-engine-id&gt;</td>
        <td>none</td>
        <td>See Item responses</td>
        <td>JSON status information about the Engine and sub-resources</td>
        <td>Reports Engine status</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/engines/&lt;some-engine-id&gt;/events</td>
        <td>none</td>
        <td>See Collection responses</td>
        <td>JSON event formulated as defined in the Engine docs</td>
        <td>Creates an event but may not report its ID since the Event may not be persisted, only used in the algorithm</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/engines/&lt;some-engine-id&gt;/queries</td>
        <td>none</td>
        <td>See Collection responses</td>
        <td>JSON query formulated as defined in the Engine docs</td>
        <td>Creates a query and returns the result(s) as defined in the Engine docs</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/engines/&lt;some-engine-id&gt;/imports?import_path=&lt;some-path&gt;</td>
        <td>none</td>
        <td>202 "Accepted" or Collection error responses</td>
        <td>none</td>
        <td>The parameter tells Harness where to import from, see the harness import command for the file format</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/engines/&lt;some-engine-id&gt;/configs</td>
        <td>none</td>
        <td>See Collection responses</td>
        <td>new config to replace the one the Engine is using</td>
        <td>Updates different params per Engine type, see Engine docs for details</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/engines/&lt;some-engine-id&gt;/jobs</td>
        <td>JSON params for batch training if defined by the Engine</td>
        <td>See Item responses</td>
        <td>202 or collection error responses</td>
        <td>Used to start a batch training operation for an engine. Supplies any needed identifiers for input and training defined by the Engine</td>
    </tr>
</table>    

# Harness User And Permission APIs

These APIs allow the admin user to create new users granting access to certain resource types. Read no further if you do not use the Auth-server.

These APIs act as a thin proxy for communication with the Auth-Server. They are provided as endpoints on the main Harness rest-server for simplicity but are actually implemented in the Auth-Server microservice. They manage Users by roles and resource-ids.


<table>
    <tr>
        <th>HTTP Verb</th>
        <th>URL</th>
        <th>Request Body</th>
        <th>Response Code</th>
        <th>Response Body</th>
        <th>Function</th>
    </tr>
    <tr>
        <td>POST</td>
        <td>/users</td>
        <td>{"roleSetId": "client" | "admin", "resourceId": "some id"}</td>
        <td>See Collection responses</td>
        <td>{"userId": "user_id", “secret”: "token"}</td>
        <td>Create a new user and generate a secret and user-id, setup internal management of the user-id that does not require saving the secret</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/users?offset=0&amp;limit=5</td>
        <td>none</td>
        <td>See Collection responses</td>
        <td>&#91;{"userId": "user-id", "roleSetId": "client" |  "admin", "engines": &#91;"engine-id-1", "engine-id-2", ...&#93;}, ...&#93;</td>
        <td>List all users, roles, and resources they have access to</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>/users/user-id</td>
        <td>none</td>
        <td>see Item responses</td>
        <td>{"userId": "user-id"}</td>
        <td>Delete the User and return their user-id with success</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/users/user-id</td>
        <td>none</td>
        <td>See Item responses</td>
        <td>{"userId": "user-id", "roleSetId": "client" | "admin", "engines": &#91;"engine-id-1", "engine-id-2", ...&#93;}</td>
        <td>List the user's Engines by ID along with the role set they have and potentially other info about the user</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/users/user-id/permissions</td>
        <td>{"userId": "user-id", "roleSetId": "client" | "admin","resourceId": "&lt;some-engine-id&gt;"}</td>
        <td>See Collection responses</td>
        <td>&nbsp;</td>
        <td>Grant named roleSet for the resource-id to the user with user-id</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>/users/user-id/permissions/permission-id</td>
        <td>{"roleSetId": "client | admin", "resourceId": "&lt;some-engine-id&gt;"}</td>
        <td>See Item responses</td>
        <td>{"userId": "user_id", "roleSetId": "client' | "admin", "resourceId": "&lt;some-engine-id&gt;" }</td>
        <td>Removes a specific permission from a user</td>
    </tr>
</table>


# Auth-Server REST API (Private)

This API is private and used only by Harness itself to communicate with the Auth-Server microservice, which manages Users and Permissions. Any holder of a "secret" is a User and the User may have many permissions, which are the routes and resources they are authorized to access. See [Security](harness_security) for more details

The Auth-Server is secured with connection level security no TLS or Auth itself is used. It is expected that the Auth-server runs in tandem with Harness

<table>
    <tr>
        <th>HTTP Verb</th>
        <th>URL</th>
        <th>Request Body</th>
        <th>Response Code</th>
        <th>Response Body</th>
        <th>Function</th>
    </tr>
    <tr>
        <td>POST</td>
        <td>/auth/token</td>
        <td>grant_type=password&username=user-id&password=granted-token, also app server's credentials should be provided by Authorization Basic header (see <a href="https://tools.ietf.org/html/rfc6749#section-4.3" target="_blank">ietf.org</a> for details)</td>
        <td>200 or 401</td>
        <td>{"access_token": "string", "token_type": "", "refresh_token": "optional string"}</td>
        <td>authenticates user's access and returns a session token</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/authorize</td>
        <td>{"accessToken": "string", "roleId": "string", "resourceId": "string"}</td>
        <td>200 or 403</td>
        <td>{"success": "true"}</td>
        <td>Given a session/access token authorize the access requested or return an error code</td>
    </tr>
</table>

