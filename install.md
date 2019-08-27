# Installing Apache PredictionIO-{{> pioversionnum}}


{{> deprecationblurb}}

To install or upgrade Apache PredictionIO-{{> pioversionnum}} using The Universal Recommender {{> urversion}} as an example Template.

**IMPORTANT NOTES**: 

Do not install as the "root" user. All guides assume that you have a **user** account that has sudo permission. You will have trouble if you install as "root". If your machine is clean do the following:
   
## Create User

 1. Create user for PredictionIO like `aml` on your machine (already done on [AWS AMI](https://aws.amazon.com/marketplace/pp/B01N310FF0) so if you are using the AMI skip to [**Upgrade**](#upgrade))

    ```
    adduser aml # Give it some password
    ```

    Give the `aml` user sudoers permissions and login to the new user. This setup assumes the `aml` user as the **owner of all services** including Spark and HDFS (already done on AWS AMI). Do not install or run as `root`!

 1. Add this line to the file `/etc/sudoers.d/sudo-group`
    
    ```
    # Members of the sudo group may gain root privileges
    # with no password
    %sudo  ALL=(ALL) NOPASSWD:ALL
    ```
    
    Then save and add `aml user to sudoers
    
 1. Add user to the `aml` group

    ```
    sudo usermod -a -G sudo aml
    sudo su - aml
    ```
     

## <a name="upgrade" id="upgrade"></a>Upgrade

If you already have some older version of PIO and wish to upgrade to the latest stable version.

 1. **Move old PIO**
    
     ```
     mv /path/to/pio pio-old
     ```
    
    move the directory containing the old version of PredictionIO, keep it for the configuration.
 
 2. **Download The Apache Release of PredictionIO**

    PredictionIO moved to Apache in 2016. ActionML was happy to contribute all the enhancements we made to Apache so we are all on the same codebase now.  

     ```
     git clone https://github.com/apache/incubator-predictionio.git /path/to/pio 
     ```
 
    clone to some directory, the easiest to put the new pio where you had the old one. 
  
 3. **Checkout the Master branch** (latest stable version) or use the tag for the desired release version. 

     ```
     git checkout master
     ```
    
4. **Build PredictionIO**

    Apache PredictionIO-{{> pioversionnum}} is a source release so you need to build it. This is pretty easy:

     ```
     cd /path/to/pio
     ./make-distribution
     ```
 
5. **Configure**

    If you have installed a recent version of PIO in the past, copy the configuration for it.

     ```
     cp old-pio/conf /path/to/pio/`
     ```
    
    If you are setting up a new installation use one of the setup guides [here](/docs/pio_quickstart).

To test your installation run `pio status` to make sure pio is working. Also check to make sure HDFS and and Spark are running correctly since `pio status` does not check the running status of those services.

## <a name="fresh-install" id="fresh-install"></a>Fresh Install

For a completely fresh new install follow one of the options on the <a href="http://predictionio.incubator.apache.org/install/" target="_blank">Apache PredictionIO</a> site or use one of our setup guides:
  
{{> piosetupguides}}

## Templates
 
 - **The Universal Recommender**
 
   UR installation described [here](/docs/ur_quickstart). Make sure to use the Apache compatible v0.5.0+ described there.
   
 - **Pick another Template**
   
   Visit the Apache-PredictionIO [Template Gallery](http://predictionio.incubator.apache.org/gallery/template-gallery) for a choice of Templates that implement a variety of Algorithms
     
 - **Build Any Template**

   ```
   git clone https://github-repo-for-template.git /path/to/template/directory
   cd /path/to/template/directory
   pio build
   ```
 