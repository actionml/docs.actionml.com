{{#template name='awssetupguide'}}

# AWS AMI Setup Guide: Dev Machine

***Coming Soon&mdash;we are awaiting AWS approval***

This is a guide for launching PredictionIO from the AWS-Markeplace AMI, it includes the latest Universal Recommender {{urversion}}. We recommend that you create this on a machine with at least 16G of memory. You may need 32g to process "real data" and to be useful for small production installations but it is primarily focused on being a development / proof of concept tool. 

## Requirements

 - knowledge of using a Debian derivative Linux distro, particularly Ubuntu.
 - an AWS account allowing EC2 instance creation and EBS block storage volumes with access to the AWS Marketplace. 

## Create

Goto the AWS Marketplace [here]() This will setup you through creating and instance, pick the size of machine and storage you need and choose the options to "create new keys". Download the .pem file to your computer and do the equivalent of the Linux `chmod 600 /path/to/pem-file`

## Login

You will need an ssh terminal that is compatible with OpenSSH. This is pre-installed on most desktop Linux Distributions and macOS. Windows users may use Putty but must convert Putty keys into OpenSSH compatible ones. Google "convert putty key to openssh"

 - First login as the "ubuntu" user
   
   `ssh -i /path/to/pem-file ubuntu@<public-ip-address-of-ami>` 

 - Add your ssh pubic key to the "aml" user and logout


    sudo su - aml
    ssh-keygen # hit enter for all options
    nano .ssh/autorized_keys # add your ssh public key
    # save and exit
    exit
   
   This will give you a passwordless login to the machine that is secure.
   
    ssh aml@<<public-ip-address-of-ami>
    pio status
   
   You should get a status check that is clean, pio is ready to start but not yet running. You can now create pio "apps", which are actually datasets, and check status. All required services like Elasticsearch, HBase, Hadoop Distributed File System are running and will restart when the instance is restarted but the PIO servers are not yet running.

##Start PredictionIO 

To start the PredictionIO EventServer, which is the input gathering part of the system, go to some place you want logs to be stored, like `/usr/local/pio` and start the EventServer as a Daemon.

    nohup pio eventserver &

You can now look are the most recent output of the EventServer logs by looking at the end of the file `nohup.out`. This will continue to accumulate logs so it will grow as long as the EventServer is running.

##Try Out The Universal Recommender

The Universal Recommender is supplied as an example of an Apache PredictionIO template. It is one of the more popular ones but any template may be installed and run on this machine.

    cd ur
    ./examples/integration-test
    
The test will run several stages that create an empty app/dataset, fill it with sample data, build the Universal Recommender, use it to create a model from the dataset, deploy a PredictionServer hosting the UR, make a bunch of sample queries, compare them to the expected results and print the differences. So no differences means the test passes.

The script `examples/integration-test` shows how to run all stages of PredictionIO and the Universal Recommender. `examples/import_handmade.py` shows how to use the Python SDK to send data to the EventServer. You can also use REST of any of the other language SDKs for PHP, Java, iOS, and Ruby. See the [Apache PredicitonIO site](http://predictionio.incubator.apache.org/) for details.

##What Now?

Using Git you can download any of the Apache PredictionIO templates. These each contain a type of Machine Learning algorithm to accomplish some task. See the [PIO Tempalate Gallery](http://predictionio.incubator.apache.org/gallery/template-gallery/) for some choices.

##Support

PredictionIO does no Machine Learning itself, it is a high performance scalable framework that does all the work like dataset storage and maintenance, model storage, command line interface and other things that all algorithms need. It provides an API that algorithms use to become a *template*. The *template* is where the Machine Learning happens so if you have questions about PredictionIO's functions look to the Apache [PredictionIO support page](http://predictionio.incubator.apache.org/support/).

if you have questions about specific *templates* look to the place the template creator points you. This is usually in the template description in the Template Gallery. For the Universal Recommender is it in this [Google Group](https://groups.google.com/forum/#!forum/actionml-user).

For **Commercial Support** including customization of existing templates, integration with your apps, creating right-scaled deployments, or even help in maintaining and operating virtual private clouds, we at ActionML are happy to help. [Contact us](http://actionml.com#contact) with your requirements or questions.

{{/template}}