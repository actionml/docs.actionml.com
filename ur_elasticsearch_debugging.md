{{#template name='ur_elasticsearch_debugging'}}
# Debugging You Model In Elasticsearch

We often get questions about why a query returns no results. The answer is seldom a bug in the code (never say never I guess) but is a bug in the model. In other words the input has caused a mistake in the model so queries don't seem to work as expected.

We resort to direct queries to Elasticsearch to examine what is in the model. Many mistakes can be easily seen there.

## The Debugging Tool: Sense

Get the Chrome extension called [Sense](https://chrome.google.com/webstore/detail/sense-beta/lhjgkmllcaadmopgmanpapmpjgmfcfig?utm_source=chrome-ntp-icon). It has been taken over by Elasticsearch but is still available as an independent Chrome extension in the Chrome Store. Search if the above link doesn't work.

Install and enable Sense and launch it from the app buttons in Chrome. Set the Elasticsearch server and point it to port 9200, which is the default REST port for Elasticsearch. From now on any REST URL + JSON body will be sent to the server and the result will be pretty printed JSON in the result Pane. For example, to get cluster health execute the highlighted REST command.

![image](/docs/images/ur-sense-cluster-health.png)

## Example of a Good Model

The UR comes with some sample trivial data. scripts to input, and build a model, which is store in Elasticsearch. Here 

## Missing Properties 



{{/template}}