# Upgrading or Installing

As of PredictionIO {{> pioversion}} using The Universal Recommender {{> urversion}} as an example template follow these steps to upgrade or do a quick install.

**IMPORTANT NOTES**: 

 1. Do not install as the "root" user. All guides assume that you have a **user** account that has sudo permission. You will have trouble if you install as "root". If your machine is clean do the following:
   
    1.1 Create user for PredictionIO `aml` in each server

        adduser aml # Give it some password

    1.2 Give the `aml` user sudoers permissions and login to the new user. This setup assumes the `aml` user as the **owner of all services** including Spark and Hadoop (HDFS). Do not install or run as `root`!

        sudo nano /etc/sudoers.d/sudo-group
    
    Add this line to the file
    
        # Members of the sudo group may gain root privileges
        # with no password (somewhat controversial)
        %sudo  ALL=(ALL) NOPASSWD:ALL

    Then save and add aml user to sudoers
    
        sudo usermod -a -G sudo aml
        sudo su aml # or exit and login as the aml user
        cd ~
        sudo service sudo restart # just to be sure permission are all active 
   
 2. You need to build pio on your machine since this sets up class caches in `~/.ivy2/...` and before you build or download you should erase the classes in that cache with `rm -r ~/.ivy2`

## Upgrade

If you already have some version of PIO you should upgrade.

### Move old PIO

 1. `mv /path/to/pio pio-old` move the directory containing the old version of PredictionIO, keep it for the configuration.
 2. `rm -r ~/.ivy2` This is required and will remove the old version of the local cache of classes created when building PredictionIO and templates.
 
### Download ActionML's Release of PredictionIO

ActionML has enhanced the original version of PredcitionIO v0.9.5 and has been enhancing it through several new versions. Our templates rely on these enhancements so use these installation instructions. to get the right version&mdash;do not rely on docs.prediciton.io

 1.  `git clone https://github.com/actionml/PredictionIO.git pio-aml` clone to some directory. **Make sure you are on the master branch** or use the tag for the desired release version. `git checkout master` is usually what you want.
 
### Build PredictionIO

You must build PredictionIO from source to get needed classes installed in your local cache or the Universal Recommender will not build, you will get error in `pio build`. This is pretty easy:

 1. `cd /path/to/pio-aml`
 2. `./make-distribution`
 
### Configuration

If you have installed a recent version of PIO in the past, copy the configuration for it.

 3. `cp old-pio/conf /path/to/pio-aml`
 
Make sure to configure all components using one of the setup guides [here](/docs/pio_quickstart).

To test your installation run `pio status` to make sure pio is working. Also check to make sure HDFS and and Spark are running correctly since `pio status` does not check the running status of those services.

## Install Fresh

For a first-time install on a single machine. **NOTE**: do not install as "root"! Create a sudoer user as described above.

### Install From a Script

For a completely fresh new install, do not use the script on PredictionIO's docs site do the following:

 1. `bash -c "$(curl -s https://raw.githubusercontent.com/actionml/PredictionIO/master/bin/install.sh)"`
 
This will create a `vendors` subdirectory with needed services installed there. It will also trigger an build of PIO so make sure you put it in a place where you have permission to read/write. q

**Note**: this is only for a single machine developer setup and is not advised for production.

### Manual Installation Guides

{{> piosetupguides}}

## Templates
 
 - The Universal Recommender
 
   UR installation described [here](/docs/ur_quickstart).
  
 - Build Any Template

   Building a template with this version of PredictionIO is just the same as before:

       git clone https://github-repo.git/path/to/template /path/to/template/directory
       cd /path/to/template/directory
       pio build
