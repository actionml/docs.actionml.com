# Users and Roles

Harness has a microservice for use in systems that require Authorization and Authentication (Auth). The service maintains resources that define a User and their Role. Two Roles are predefined: `client` and `admin`. 

Clients are granted access to any number of Engines by ID and their sub-resources: Events and Queries. The admin has access to all parts of Harness. Only an Admin User can manage Users and Roles.

# Commands

When Harness is setup to use Auth it makes extended commands available for managing Users and Roles. See [Security](/docs/harness_security) for more information about the use of Auth.

 - **`harness user-add [client <engine-id> | admin]`** returns the user-id and secret that gives client access to the engine-id specified OR gives the user-id admin global superuser access.
 - **`harness user-delete <some-user-id>`** removes the user and any role they have, in effect revoking their credentials. A warning will be generated when deleting an admin user.
 - **`harness grant <user-id> [client <engine-id> | admin]`** modifies some existing User giving a new Role, including elevating the User to admin / super user status.
 - **` harness revoke <user-id> [client <engine-id>| admin]`** revokes some existing Role for a User
 - **`harness status users [<some-user-id>]`** list all Users and their Roles or give User specific details.

