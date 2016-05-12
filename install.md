{{#template name='install'}}
# Upgrading ActionML's PredictionIO

As of PredictionIO v0.9.7-aml and The Universal Recommender v0.3.0 follow these steps to upgrade.

## Move old PIO

 1. `mv /path/to/pio pio-old` move the directory containing the old version of PredictionIO, keep it for the configuration.
 2. `rm -r ~/.ivy2` This is required and will remove the local cache of classes created when building PredictionIO and templates.
 
## Download ActionML's Release of PredictionIO

ActionML has enhanced the original version of PredcitionIO v0.9.5 and has been enhancing it through several new versions. Our templates rely on these enhancements so use these installation instructions. to get the right version&mdash;do not rely on docs.prediciton.io

 1. `git clone https://github.com/actionml/PredictionIO.git pio-aml` clone to some directory. **Make sure you are on the master branch** or use the tag for the desired release version. `git checkout master` is usually what you want.
 
Proceed to **Build PredictionIO**
 
## Install From a Script

For a completely fresh new install, do not use the script on PredictionIO's docs site do the following:

 1. `bash -c "$(curl -s https://github.com/actionml/PredictionIO/blob/develop/bin/install.sh`
 
This will create a `vendors` subdirectory with needed services installed there. This is only for a single machine developer setup and is not advised for Production.

## Build PredictionIO

You must build PredictionIO from source to get needed classes installed in your local cache or the Universal Recommender will not build, you will get error in `pio build`. This is pretty easy:

 1. `cd /path/to/pio-aml`
 2. `./make-distribution`
 
     If you have installed a recent version of PIO in the past, copy the configuration for it.

 3. `cp old-pio/conf /path/to/pio-aml`
 
Make sure to install and configure all components using the methods described [here](https://github.com/actionml/cluster-setup/blob/master/readme.md).

To test your installation run `pio status` to make sure pio is working. Also check with  to make sure HDFS and and Spark are running correctly since `pio status` does not check the running status of those services.
 
## Build Universal Recommender
 
  UR installation described [here](/docs/ur_quickstart).
  
## Build Any Template

Building a template with this version of PredictionIO is just the same as before:

    git clone https://github-repo.git /path/to/template/directory
    cd /path/to/template/directory
    pio build

{{/template}}