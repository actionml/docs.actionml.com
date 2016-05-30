{{#template name='ur_quickstart'}}
# UR Quickstart

We assume you have already installed pio-aml, by following one the the [guides](/docs/pio_quickstart). 

Check that pio-aml is running

    pio status
    
It all is well proceed with the Universal Recommender

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
    
## Get The Universal Recommender Template

    git clone https://github.com/actionml/template-scala-parallel-universal-recommendation.git ~/universal
    cd ~/universal
    git checkout master # or whatever tagged release you want

It's recommended that you run the UR integration test

    ./examples/integration-test
    
You will have a diff printed of expected and actual results. The order if returned items may vary **if** they have the same score, otherwise results should match.

After the integration test you will have a prediction server running on port 8000 of localhost. Try some queries:

    ./examples/multi-query-handmade.sh

This is the set of queries used in the test. Take a look at the file and pull out an individual query like:

    curl -H "Content-Type: application/json" -d '
    {
        "user": "u1"
    }' http://localhost:8000/queries.json

There are many examples of queries in the examples so use it to see how to form them in JSON. You can also query using one of the SDKs for several different languages. SDKs are available from the primary language package installers just as we used the python version above.

 - [Python](https://github.com/actionml/PredictionIO-Python-SDK)
 - [Ruby](https://github.com/PredictionIO/PredictionIO-Ruby-SDK)
 - [Java](https://github.com/PredictionIO/PredictionIO-Java-SDK)
 - [PHP](https://github.com/PredictionIO/PredictionIO-PHP-SDK)

{{/template}}
