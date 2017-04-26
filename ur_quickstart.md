# UR Quickstart

We assume you have already installed Apache PredictionIO {{> pioversionnum}}, by following one the the [guides](/docs/install). 

Check that pio is running

    pio status
    
If all is well proceed with the Universal Recommender

## Prerequisites

 - python 2.7.9+
 - pip, the package installer for python
 - git, for version control and installing templates like the UR

The Universal Recommender has an integration test written in Python. If you want to run the test make sure you have it installed

    python --version

You should have 2.7.9+ ( do not use Python 3+ since is not source compatible with scripts written in Python 2). Check to see that `pip` is installed 

    pip --version

If you don't have it see these [installation instructions](http://pip.readthedocs.io/en/latest/installing/#install-pip). Once pip is available install the python packages needed for the integration test  

    sudo pip install predictionio datetime
    
## <a name="build_mahout" id="build_mahout"></a>Build Mahout (Temporary but Necessary) 

If you want to use the latest Universal Recommender {{> urversion}}, it will require a local build of Mahout 0.13.0-SNAPSHOT, until Mahout 0.13.0 is released.  Pull the repo from Github and build it locally on the machine you expect to build the Universal Recommender. We will update the UR as soon as Mahout 0.13.0 is released to avoid this extra step. 

**Prerequisites:**

 - Maven 3.x
 - Java 1.8 (OpenJDK or Oracle)
 - Git

```
git clone https://github.com/apache/mahout.git mahout
cd mahout
git checkout 00a2883ec69b0807a5486c61dfcc7ef27f35ddc6
mvn clean install -DskipTests
```

This will populate the local cache with updated Mahout classes that are needed by the latest Universal Recommender Template. 

## Build The Universal Recommender

If you have already clone the universal-recommender in the installation process, you don't need to clone it again. 

```
git clone https://github.com/actionml/universal-recommender.git ~/ur
cd ~/ur
git checkout master # or whatever tagged release you want, read below
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

## Don't want to build Mahout?

To get a version of the UR that does not require the latest Mahout get the UR v0.3.0 tagged version like this, but be aware that it is incompatible with Apache PredictionIO-{{> pioversionnum}} and requires the ActionML fork [PredictionIO-0.9.7-aml](https://github.com/actionml/PredictionIO). Once this is insatlled get the older version of the UR:

```
git clone https://github.com/actionml/template-scala-parallel-universal-recommendation.git ~/universal
cd ~/universal
git checkout v0.3.0
```
