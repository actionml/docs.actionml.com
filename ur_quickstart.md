# UR Quickstart

We assume you have already installed Apache PredictionIO {{> pioversionnum}}, by following one the the [guides](/docs/install). 

Check that pio is running

    pio status
    
If there is a problem make sure the PIO EventServer has been started with 

    nohup pio eventserver & # starts in the background   
    
If all is well proceed with the Universal Recommender. 

## Prerequisites

 - python3 for version 3.5+
 - pip3, the package installer for python3
 - git, for version control and installing templates like the UR

The Universal Recommender has an integration test written in Python. If you want to run the test make sure you have it installed

    python3 --version

You should have 3.5+. Check to see that `pip` is installed 

    pip3 --version

If you don't have it see these [installation instructions](http://pip.readthedocs.io/en/latest/installing/#install-pip). Once pip is available install the python packages needed for the integration test  

    sudo pip3 install predictionio datetime
    
## Build The Universal Recommender

```
git clone https://github.com/actionml/universal-recommender.git ~/ur
cd ~/ur
git checkout master # or tag 0.7.2+
```

It's recommended that you run the UR integration test

```
./examples/integration-test
```
    
If no "diff" is printed the test passes.

The integration test will launch a The UR query server (PredictionServer) and take it down afterwards. To try some sample queries, launch it again:

```
pio deploy
# switch to a new terminal and
cd ~/universal
./examples/multi-query-handmade.sh
```

On the `pio deploy` terminal you will see the internal Elasticsearch queries, in the UR query terminal you will see the recommendations results.

Take a look at `examples/multi-query-handmade.sh` and pull out an individual query like:

```
curl -H "Content-Type: application/json" -d '
{
    "user": "u1"
}' http://localhost:8000/queries.json
```

There are many examples of queries in the examples directory so use them to see how to form the JSON and query parameters. You can also query using one of the PredictionIO SDKs for several different languages, go to [Apache PIO](http://predictionio.incubator.apache.org/datacollection/eventapi/) click "Integrating with your App" and "List of SDKs".
