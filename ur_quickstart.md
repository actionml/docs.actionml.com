# UR Quickstart

We assume you have already installed pio-aml, by following one the the [guides](/docs/install). 

Check that pio-aml is running

    pio status
    
If all is well proceed with the Universal Recommender

## Prerequisites

 - python 2.7.9+
 - pip, the package installer for python
 - git, for version control and installing templates like the UR

The Universal Recommender has an integration test written in Python. If you want to run the test make sure you have it installed

    python --version

You should have 2.7.9 or above. Check to see that `pip` is installed 

    pip --version

If you don't have it see these [installation instructions](http://pip.readthedocs.io/en/latest/installing/#install-pip). Once pip is available install the python packages needed for the integration test  

    sudo pip install predictionio datetime
    
## Build The Universal Recommender Template

**Notice:** If you want to use the UR v0.4.2+, it will require a local build of Mahout 0.13.0-pat, until Mahout 0.13.0 is released.  Pull the repo from Github and build it locally on the machine you expect to build the Universal Recommender. We will update the UR as soon as Mahout v0.13.0 is released to avoid this extra step. 

    git clone https://github.com/apache/mahout.git
    cd mahout
    # if you do not have Maven 3.x installed see instructions here: 
    mvn clean install -DskipTests

Now get the latest Universal Recommender

    git clone https://github.com/actionml/template-scala-parallel-universal-recommendation.git ~/universal
    cd ~/universal
    git checkout v0.4.2 # or whatever tagged release you want, read below
    
To get a version of the UR that does not require the latest Mahout get the UR v0.3.0 tagged version like this:

    git clone https://github.com/actionml/template-scala-parallel-universal-recommendation.git ~/universal
    cd ~/universal
    git checkout v0.3.0

It's recommended that you run the UR integration test

    ./examples/integration-test
    
You will have a diff printed of expected and actual results. The order if returned items may vary **if** they have the same score, otherwise results should match.

The integration test will launch a The UR querey server (PredictionServer) and take it down afterwards. To try some sample queries, launch it again:
    
    pio deploy
    # switch to a new terminal and
    cd ~/universal
    ./examples/multi-query-handmade.sh

On the `pio deploy` terminal you will see the internal Elasticsearch queries, in the UR query terminal you will see the recommendations results.

Take a look at `examples/multi-query-handmade.sh` and pull out an individual query like:

    curl -H "Content-Type: application/json" -d '
    {
        "user": "u1"
    }' http://localhost:8000/queries.json

There are many examples of queries in the examples so use it to see how to form them in JSON. You can also query using one of the SDKs for several different languages. SDKs are available from the primary language package installers just as we used the python version above.

 - [Python](https://github.com/actionml/PredictionIO-Python-SDK)
 - [Ruby](https://github.com/actionml/PredictionIO-Ruby-SDK)
 - [Java](https://github.com/actionml/PredictionIO-Java-SDK)
 - [PHP](https://github.com/actionml/PredictionIO-PHP-SDK)
