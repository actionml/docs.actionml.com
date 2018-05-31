# AWS AMI Setup Guide: Dev Machine

**Note**: after release of Apache PredictionIO {{> pioversion}} and The Universal Recommender {{> urversion}} AWS will take some days to approve the new AMI. Until then the older version works but with none of the new features. Please bear with us as page reflects the previous version of the AMI until AWS updates it.

PredictionIO is now available to launch pre-installed on Amazon Web Services [here](https://aws.amazon.com/marketplace/pp/B01N310FF0). This guide will step through how to create an instance and use it.

Features: 

 -  Apache PredictionIO {{> pioversion}} installed and configured
 -  The Universal Recommender {{> urversion}} pre-installed
 -  Can run any Apache PIO Template from [these choices](http://predictionio.incubator.apache.org/gallery/template-gallery/)
 -  All-in-one setup running on a single instance
 -  Launches and runs HBase, Elasticsearch, HDFS, and Spark on boot automatically
 -  Ubuntu 18.04 LTS

## Requirements

 - Basic understanding of 'nix.
 - An AWS account allowing EC2 instance creation and EBS block storage volumes. 

## Create

 - Go to the [AWS AMI](https://aws.amazon.com/marketplace/pp/B01N310FF0) page and pick "continue".
 - As you create an instance pick the size of machine and storage you need and choose the option to "create new keys". 
 - Download the .pem file to your computer and do the equivalent of the Linux `chmod 600 /path/to/pem-file` so that only the file owner has permission to read and write.

## Login

You will need an ssh terminal that is compatible with OpenSSH. This is pre-installed on most desktop Linux Distributions and macOS. Windows users may use Putty but must convert Putty keys into OpenSSH compatible ones. Google "convert putty key to OpenSSH". For Windows users it is often useful to create a Virtual Machine with Linux running inside if only because you will be using the same commands on your dev machine as on the AWS instance.

Using your terminal where OpenSSH has been installed:

 - Login as the "ubuntu" user
 
     ```
     ssh -i /path/to/pem-file ubuntu@public-ip-address-of-instance
     ```

 - Add your ssh pubic key to the "aml" user and logout. This will require that the machine you will use as a terminal/ssh connection has a public key installed. For the Mac or Linux look in `~/.ssh/id_rsa.pub`. Copy it's contents to add to the AWS machine's `~/.ssh/authorized_keys` with these commands:

     ```
     sudo su - aml
     ssh-keygen # hit enter for all options
     nano .ssh/authorized_keys # add/paste your ssh public key
     #save and logout
     exit
     ```
   
   This will give you a passwordless login to the machine that is secure. Using the terminal of your dev machine:
   
     ```
     ssh aml@public-ip-address-of-instance
     ```
   
   PIO is ready to start but not yet running though all backend services are already running, including Elasticsearch, HBase, Hadoop's Distributed File System (HDFS), which all start at boot time .

## Start PredictionIO 

To start the PredictionIO EventServer, which is the input gathering part of the system:

 - Go to some place you want logs to be stored, like `/usr/local/pio` and start the EventServer as a Daemon.

     ```
     cd /usr/local/pio # this is where logs will be stored
     nohup pio eventserver &
     cd ~
     pio status
     pio app list # there should be none yet
     ```

You can now look are the most recent output of the EventServer logs by looking at the end of the file `nohup.out` and `pio.log`. These will continue to accumulate logs so they will grow as long as the EventServer is running.

## Run the System Test

The Universal Recommender is supplied as an example of an Apache PredictionIO template. It is one of the more popular ones but any template may be installed and run on this machine. 

 - Use the UR to run a system test. This assumes you have started the EventServer as shown above

     ```
     cd ~/ur
     ./examples/integration-test
     ```
    
The test will run several stages that create an empty app/dataset, fill it with sample data, build the Universal Recommender, use it to create a model from the dataset, deploy a PredictionServer for UR queries, make a bunch of sample queries to test features, compare them to the expected results and print the differences, then shutdown the PredictionServer. No differences means the test passes.

The script `examples/integration-test` shows how to run all stages of PredictionIO and the Universal Recommender. `examples/import_handmade.py` shows how to use the Python SDK to send data to the EventServer. You can also use REST or any of the other language SDKs for PHP, Java, iOS, and Ruby. See the [Apache PredicitonIO site](http://predictionio.incubator.apache.org/) for details. Go to "Integrating with Your App" &mdash;> "List of SDKs"

## What Now?

### Apache PredictionIO

You instance is supplied with Apache PredictionIO {{> pioversionnum}} so you can read instructions at the [PIO site](http://predictionio.incubator.apache.org/) or, if you know PIO already, use commands from our [PIO Cheatsheet](/docs/pio_cli_cheatsheet). **Warning**: never us `pio-start-all` script since it will damage the already running setup, likewise never use `pio-stop-all`. These are never needed on this AWS AMI.

### The Universal Recommender

To configure and use the Universal Recommender see the docs [here](/docs/ur). You have already run it in the integration test so it is all set up.

### Other PIO Templates

Using Git you can download any of the Apache PredictionIO templates. These each contain a type of Machine Learning algorithm to accomplish some task. See the [PIO Tempalate Gallery](http://predictionio.incubator.apache.org/gallery/template-gallery/) for some choices.

## Support

PredictionIO does no Machine Learning itself, it is a high performance scalable framework that does all the work like dataset storage and maintenance, model storage, command line interface and other things that all algorithms need. It provides an API that algorithms use to become a ***Template***. The ***Template*** is where the Machine Learning happens so support for PIO is separate from the templates.

If you have questions about PredictionIO's functions look to the Apache [PredictionIO support page](http://predictionio.incubator.apache.org/support/).

The Universal Recommender and other ActionML templates, including this AWS AMI get free community support in the [ActionML Google Group](https://groups.google.com/forum/#!forum/actionml-user).

**Commercial Support** including Apache PredictionIO, customization of existing templates, integration with your apps, creating right-scaled deployments, or even help in maintaining and operating virtual private clouds, we at ActionML are happy to help. [Contact us](http://actionml.com#contact) with your requirements or questions.
