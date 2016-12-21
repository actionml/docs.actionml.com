
 1. Create user for PredictionIO `aml` in each server

    ```
    adduser aml # Give it some password
    ```

 2. Give the "aml" user sudoers permissions and login to the new user. This setup assumes the aml user as the **owner of all services** including Spark and Hadoop (HDFS).

    ```
    usermod -a -G sudo aml
    sudo su - aml
    ```
 3. Setup passwordless ssh between all hosts of the cluster. This is a combination of adding all public keys to `authorized_keys` and making sure that `known_hosts` includes all cluster hosts, including any host to itself. There must be no prompt generated when any host tries to connect via ssh to any other host. **Note:** The importance of this cannot be overstated! If ssh does not connect without requiring a password and without asking for confirmation **nothing else in the guide will work!**