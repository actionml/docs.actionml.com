# Installing Apache PredictionIO-{{pioversionnum}}

To install or upgrade Apache PredictionIO-{{> pioversionnum}} using The Universal Recommender {{> urversion}} as an example Template.

**IMPORTANT NOTES**: 

Do not install as the "root" user. All guides assume that you have a **user** account that has sudo permission. You will have trouble if you install as "root". If your machine is clean do the following:
   
## Create User

Create user for PredictionIO like `aml` on your machine (already done on AWS AMI so if you are using the AMI skip to [**Upgrade**](#upgrade))

`adduser aml # Give it some password`

Give the `aml` user sudoers permissions and login to the new user. This setup assumes the `aml` user as the **owner of all services** including Spark and HDFS(already done on AWS AMI). Do not install or run as `root`!

`sudo nano /etc/sudoers.d/sudo-group`
    
 Add this line to the file
    
```
# Members of the sudo group may gain root privileges
# with no password (somewhat controversial)
%sudo  ALL=(ALL) NOPASSWD:ALL
```
    
Then save and add aml user to sudoers
    
```
sudo usermod -a -G sudo aml
sudo su - aml
```
     

## <a name="upgrade" id="upgrade"></a>Upgrade

If you already have some older version of PIO and wish to upgrade to the latest stable version.

- **Move old PIO**
    
    ```
    mv /path/to/pio pio-old
    ```
    
  move the directory containing the old version of PredictionIO, keep it for the configuration.
 
- **Download The Apache Release of PredictionIO**

  PredictionIO moved to Apache in 2016. ActionML was happy to contribute all the enhancements we made to Apache so we are all on the same codebase now.  

    ```
    git clone https://github.com/apache/incubator-predictionio.git /path/to/pio` 
    ```
 
  clone to some directory, the easiest to put the new pio where you had the old one. **Make sure you are on the master branch** or use the tag for the desired release version. 

    ```
    git checkout master
    ```
    
- **Build PredictionIO**

  You must build PredictionIO from source to get needed classes installed in your local cache or the Universal Recommender will not build, you will get error in `pio build`. This is pretty easy:

    ```
    cd /path/to/pio
    ./make-distribution
    ```
 
- **Configure**

  If you have installed a recent version of PIO in the past, copy the configuration for it.

    ```
    cp old-pio/conf /path/to/pio-aml`
    ```
    
  Make sure to configure all components using one of the setup guides [here](/docs/pio_quickstart).

 To test your installation run `pio status` to make sure pio is working. Also check to make sure HDFS and and Spark are running correctly since `pio status` does not check the running status of those services.

## <a name="fresh-install" id="fresh-install"></a>Fresh Install

For a first-time install on a single machine. **NOTE**: do not install as "root"! Create a sudoer user as described above.

For a completely fresh new install of a developer machine (usally not planned for production) follow one of the options on the Apache PredictionIO site <a href="http://predictionio.incubator.apache.org/install/" target="_blank">here</a> or install the AWS AMI:
  
Our guide are more for production installations though the AWS AMI can theoretically be used for both dev and production.

{{> piosetupguides}}

## Templates
 
 - The Universal Recommender
 
   UR installation described [here](/docs/ur_quickstart). Make sure to use the Apache compatible v0.5.0+ described there.
     
 - Build Any Template

   ```
   git clone https://github-repo.git/path/to/template /path/to/template/directory
   cd /path/to/template/directory
   pio build
   ```
