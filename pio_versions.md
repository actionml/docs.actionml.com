# PredictionIO-{{> pioversion}}

ActionML is a direct contributor to the Apache PredictionIO project. The current stable release is {{> pioversion}} Install from [here](/docs/install) or use one of several methods described on the [Apache PredictionIO site](http://predictionio.incubator.apache.org/install/)

# PIO Events Accumulate Forever

PIO by default will continue to accumulate events forever, which will eventually make even Big Data fans balk at storage costs and it will cause model training to take longer and longer. The answer to this is to trim and/or compress the PIO EventStore for a specific dataset. This can be done by a simple mod to your template code described below or can be run as a separate job using a template made for this purpose called the [/docs/db_cleaner_template]().

