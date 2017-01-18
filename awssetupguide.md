# AWS AMI Setup Guide: Dev Machine

PredictionIO is now available to launch pre-installed on Amazon Web Services [here](https://aws.amazon.com/marketplace/pp/B01N310FF0). This guide will step through how to create an instance and use it.

Features: 

 -  Apache PredictionIO {{> pioversion}} installed and configured
 -  The Universal Recommender {{> urversion}} pre-installed
 -  Can run any Apache PIO Template from [these choices](http://predictionio.incubator.apache.org/gallery/template-gallery/)
 -  All-in-one setup running on a single instance
 -  Launches and runs HBase, Elasticsearch, HDFS, and Spark on boot automatically
 -  Ubuntu 16.04 LTS

## Requirements

 - Basic understanding of Linux
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

 - Add your ssh pubic key to the "aml" user and logout

   ```
   sudo su - aml
   ssh-keygen # hit enter for all options
   nano .ssh/authorized_keys # add your ssh public key
   ```
   
   This will give you a passwordless login to the machine that is secure.
   
   ```
   ssh aml@public-ip-address-of-instance
   pio status
   ```
   
   You should get a status check that is clean, pio is ready to start but not yet running. You can now create pio "apps", which are actually datasets, and check status. All required services like Elasticsearch, HBase, Hadoop's Distributed File System (HDFS) are running and will restart when the instance is restarted.

## Start PredictionIO 

All needed services startup on boot and should be running. To start the PredictionIO EventServer, which is the input gathering part of the system:

 - Go to some place you want logs to be stored, like `/usr/local/pio` and start the EventServer as a Daemon.

    ```
    nohup pio eventserver &
    ```

You can now look are the most recent output of the EventServer logs by looking at the end of the file `nohup.out`. This will continue to accumulate logs so it will grow as long as the EventServer is running.

## Try Out The Universal Recommender

The Universal Recommender is supplied as an example of an Apache PredictionIO template. It is one of the more popular ones but any template may be installed and run on this machine.

    ```
    cd ur
    ./examples/integration-test
    ```
    
The test will run several stages that create an empty app/dataset, fill it with sample data, build the Universal Recommender, use it to create a model from the dataset, deploy a PredictionServer for UR queries, make a bunch of sample queries to test features, compare them to the expected results and print the differences, then shutdown the PredictionServer. No differences means the test passes.

The script `examples/integration-test` shows how to run all stages of PredictionIO and the Universal Recommender. `examples/import_handmade.py` shows how to use the Python SDK to send data to the EventServer. You can also use REST or any of the other language SDKs for PHP, Java, iOS, and Ruby. See the [Apache PredicitonIO site](http://predictionio.incubator.apache.org/) for details. Go to "Integrating with Your App" &mdash;> "List of SDKs"

## What Now?

To configure and use the Universal Recommender see the docs [here](/docs/ur)

Using Git you can download any of the Apache PredictionIO templates. These each contain a type of Machine Learning algorithm to accomplish some task. See the [PIO Tempalate Gallery](http://predictionio.incubator.apache.org/gallery/template-gallery/) for some choices.

## Support

PredictionIO does no Machine Learning itself, it is a high performance scalable framework that does all the work like dataset storage and maintenance, model storage, command line interface and other things that all algorithms need. It provides an API that algorithms use to become a ***Template***. The ***Template*** is where the Machine Learning happens so support for PIO is separate from the templates.

If you have questions about PredictionIO's functions look to the Apache [PredictionIO support page](http://predictionio.incubator.apache.org/support/).

The Universal Recommender and other ActionML templates, including this AWS AMI get free community support in the [ActionML Google Group](https://groups.google.com/forum/#!forum/actionml-user).

**Commercial Support** including Apache PredictionIO, customization of existing templates, integration with your apps, creating right-scaled deployments, or even help in maintaining and operating virtual private clouds, we at ActionML are happy to help. [Contact us](http://actionml.com#contact) with your requirements or questions.
