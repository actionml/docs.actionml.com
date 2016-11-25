# Debugging Your Model In Elasticsearch

We often get questions about why a query returns no results. The answer is seldom a bug in the code (never say never I guess) but is a bug in the model. In other words the input has caused a mistake in the model so queries don't seem to work as expected.

We resort to direct queries to Elasticsearch to examine what is in the model. Many mistakes can be easily seen there.

## The Debugging Tool: Sense

Get the Chrome extension called [Sense](https://chrome.google.com/webstore/detail/sense-beta/lhjgkmllcaadmopgmanpapmpjgmfcfig?utm_source=chrome-ntp-icon). It has been taken over by Elasticsearch but is still available as an independent Chrome extension in the Chrome Store. Search if the above link doesn't work.

Install and enable Sense and launch it from the app buttons in Chrome. Set the Elasticsearch server and point it to port 9200, which is the default REST port for Elasticsearch. From now on any REST URL + JSON body will be sent to the server and the result will be pretty printed JSON in the result Pane. For example, to get cluster health execute the highlighted REST command.

![image](/images/ur-sense-cluster-health.png)

## Example of a Good Model

The UR comes with some sample trivial data. scripts to input, and build a model, which is stored in Elasticsearch. Run `./examples/integration-test` to populate Elasticsearch with model data. It will look something like this.

![image](/images/ur-sense-good-model.png)

Notice that only the `_source` section of the document is important, the rest are for internal ES use.

There are several properties in `_source` that apply to the UR's CCO model and are not human accessible. Each will be named after the `eventNames` in `engine.json` and roughly mean that the items listed were often associated with users taking the conversion event and so if a user triggers these also, they are likely to be interested in the item in the `id` property.

The `popModel` property gives a numeric value that is used to rank all items. It is created by the UR's popularity calculation and is not directly accessible to users of the UR. The ranking of popular items will cause them to be included in recommendations if there are not other CF based recommendations for the query.

## Malformed Properties 

Notice that the properties correspond to the name you gave in the `$set` event and the values are JSON arrays of strings. This is how they must look in ES or they were encoded improperly. Dates will be strings and no user created property can be a number. If you see a user created property that is a string (other than a date), there was an error encoding it in your input `$set` event. See the the UR [input](/docs/ur_input) page for a description of how to encode properties. Everything except dates must be arrays of strings, even if there will never be more than one value.

## Missing Properties

Mistakes in formatting your properties can sometimes result in missing properties in the ES index. If there is some property missing from ES see the the UR [input](/docs/ur_input) page for a description of how to encode properties.

## PredictionServer Info Output

The Universal Recommender will output information about the query sent to Elasticsearch. This can be examined for unexpected data. For instance the JSON below is output for a user based query (pretty printed). Notice that the query has data for the `purchase` and `view` indicators, which are in the `eventNames` in `engine.json`. This means the user event history is working properly&mdash;assuming those are the most recent user events for the particular user. 

    [INFO] [URAlgorithm] Query: 
    {
        "size": 20,
        "query": {
            "bool": {
                "should": [{
                    "terms": {
                        "purchase": ["Galaxy", "Ipad-retina", "Iphone 4", "Iphone 5", "Iphone 6"]
                    }
                }, {
                    "terms": {
                        "view": ["Soap", "Mobile-acc", "Phones"]
                    }
                }, {
                    "constant_score": {
                        "filter": { "match_all": {} },
                        "boost": 0
                    }
                }],
                "must": [],
                "must_not": {
                    "ids": {
                        "values": ["Iphone 6", "Iphone 5", "Iphone 4", "Ipad-retina", "Galaxy"],
                        "boost": 0
                    }
                },
                "minimum_should_match": 1
            }
        },
        "sort": [{ "_score": { "order": "desc" } }, { "popRank": { "unmapped_type": "double", "order": "desc" } }]
    }


If you see no data for the indicators in an ES query like this:

    {
        "size": 20,
        "query": {
            "bool": {
                "should": [{
                    "terms": {
                        "purchase": []
                    }
                }, {
                    "terms": {
                        "view": []
                    }
                }, {
                    "constant_score": {
                        "filter": { "match_all": {} },
                        "boost": 0
                    }
                }],
                "must": [],
                "must_not": {
                    "ids": {
                        "values": [],
                        "boost": 0
                    }
                },
                "minimum_should_match": 1
            }
        },
        "sort": [{ "_score": { "order": "desc" } }, { "popRank": { "unmapped_type": "double", "order": "desc" } }]
    }

    
It means the EventServer has no data for that user. If this seems like an error, check to see that usage event input is formatted correctly or look at your original source data.
