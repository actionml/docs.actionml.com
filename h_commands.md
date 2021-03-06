# Commands

Harness includes an Admin command line interface. It runs using the Harness REST interface and can be run remotely. See the [Workflow](h_workflow) section for more detail.

## Conventions

Internal to Harness are ***Engines Instances*** that implement some algorithm and contain datasets and configuration parameters. All input data is validated by the engine, and must be readable by the algorithm.

Harness uses resource-ids to identify all objects in the system. The Engine Instance must have a JSON file, which contains all parameters for Harness engine management including its Engine Instance resource-id as well as algorithm parameters that are specific to the Engine type. All Harness global configuration is stored in `harness-env` see [Harness Config](harness_config) for details.

 - The file `<some-engine.json>` can be named anything and put anywhere.
 - The working copy of all engine parameters and input data is actually in a shared database. Add or update an Engine Instance to change its configuration. Changing the file will not automatically update the Engine Instance. See the `add` and `update` commands. 

# Harness Start and Stop (Optional)

If you are managing Harness with Docker of Kubernetes you will not need to use these scripts directly.

If you are deploying the Native Harness Build you can use scripts that start and stop Harness included in the project's `bin/`. These are used inside container startup and can be used directly in the OS level installation.

 - **`harness-start [-f]`** starts the harness server based on configuration in `harness-env`. The `-f` argument forces a restart if Harness is already running. All other commands require the service to be running, it is always started as a daemon/background process. All previously configured engines are started in the state they were in when harness was last run.

 - **`harness-stop`** gracefully stops harness and all engines. If the pid-file has become out of sync, look for the `HarnessServer` process with `jps -lm` or `ps aux | grep HarnessServer` and execute `kill <pid>` to stop it.

# Harness Administration

The Admin CLI is invoked with `hctl` or optionally `harness-cli`.

 - **`hctl status [engines [<engine-id>] | users [<user-id>] | system]`** These print status information about the objects requested. Asking for user status requires the Harness Auth-server, which is optional. System status returns information about the configuration and health of the system including all microservices.
 - **`hctl add <some-engine.json>`** creates and starts an Engine Instance of the type defined by the `engineFactory` parameter.
 - **`hctl update <some-engine.json>`** updates an existing Engine Instance with values defined in `some-engine.json`. The Engine knows what is safe to update and may warn if some value is not updatable but this will be rare.
 - **`hctl delete <some-engine-id>`** The Engine Instance will be stopped and the accumulated dataset and model will be deleted. No artifacts of the Engine Instance will remain except the `some-engine.json` file and any mirrored events.
 - **`hctl import <some-engine-id> [<some-directory> | <some-file>]`** This is typically used to replay previously mirrored events or load bootstrap datasets created from application logs. It is equivalent to sending all imported events to the REST API. The file must be accessible by the Harness server.
 - **`hctl export <some-engine-id> [<some-directory> | <some-file>]`** not yet implemented in {{> harnessname}} Use [mirroring](h_mirroring) to create a running log of all events received by an engine, which is equivalent to exporting the same data.
 - **`hctl train <some-engine-id>`** For Lambda style engines like the UR this will create or update a model. This is required for Lambda Engines before queries will return values.

# Harness Auth-server Administration (Optional)

There are several extended commands that manage Users and Roles. These are only needed when using the Harness Auth-server to create secure multi-tenancy. Open multi-tenancy is the default and requires no Auth-Server, meaning Harness supports multiple Engine Instances with no authorization required to access them. 

If the Harness Auth-Server is not used it is assumed that Harness API access is only allowed from trusted app servers.
       
 - **`hctl user-add [client <engine-id> | admin]`** Returns a new user-id and their secret. Grants the role's permissions. Client Users have access to one or more `engine-id`s, `admin` Users have access to all `engine-id`s as well as admin only commands and REST endpoints.
 - **`hctl user-delete <user-id>`** removes all access for the `user-id`
 - **`hctl grant <user-id> [client <engine-id> | admin]`** adds permissions to an existing user
 - **`hctl revoke <user-id> [client <engine-id> | admin]`** removes permissions from an existing user

# Bootstrapping With Import

Import can be used to restore backed up data but also for bootstrapping a new Engine instance with previously logged or collected batches of data. Imagine a recommender that takes in people's purchase history. This might exist in server logs and converting these to files of JSON events is an easy and reproducible way to "bootstrap" your recommender with previous data before you start to send live events. This, in effect, trains your recommender retro-actively, improving the quality of recommendations at its first startup. See [Harness Administration](h_commands#harness-administration).

To move data from PredictionIO, you may wish to export from PIO and import the identical data into Harness. The same file format is supported.

# Backup and Restore without Export

Since not all Harness engines store input data the "export" function cannot be implemented. Instead Harness can [mirror](h_mirroring) all data received by an engine instance (if configured in the engine's config), which operates like a log of events. These files are written in a form that can be imported when needed.
