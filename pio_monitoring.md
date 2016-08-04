{{#template name='pio_monitoring'}}

# Monitoring PredictionIO

In a running instance of PredictionIO there will be one or more EventServers and PredictionServers. Each will respond through HTTP when sent a GET request.

For the EventServer(s) do a GET request for each server.

    curl localhost:7070
    
Live servers will respond with 

    {"status":"alive"}
    
For PredictionServer(s) do a GET and you should receive an HTML status report with several pieces of information.

    curl localhost:8000

should produce something like: 

    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>org.template.RecommendationEngine (default) - PredictionIO Engine Server at 0.0.0.0:8000</title>
        <link href="/assets/bootstrap-3.2.0-dist/css/bootstrap.min.css" rel="stylesheet">
        <style type="text/css">
          td { font-family: Menlo, Monaco, Consolas, "Courier New", monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="page-header">
            <h1>PredictionIO Engine Server at 0.0.0.0:8000</h1>
            <p class="lead">org.template.RecommendationEngine (default)</p>
          </div>
          <h2>Engine Information</h2>
          ... Engine information goes here       
        </div>
      </body>
    </html>

PredictionIO uses several component services, which can also be checked, including you choice of MySQL, Postgres, or HBase, also HDFS and optionally Elasticsearch. Look in their respective docs if you wish to check their health. 

# Shortcut Method

A quick shortcut method to check the system is to issue a query to the PredictionServer. If you get the expected result this will have executed queries on the EventServer, which in turn uses your DB and, in the case of HBase, HDFS. If you have setup Elasticsearch it will also issue queries to it. The expected result from the PredictionServer will depend on your data and template.

**Note**: since the component services are distributed and may be configured in high-availability mode, this method does not guarantee that all nodes of the services are working correctly&mdash;for this resort to checking each service as recommended in their documentation.

{{/template}}
