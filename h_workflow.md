# Workflow

To Use an Engine Instance create one, use it then delete it when it is not needed. Harness workflow for any Engine Instance proceeds from input to query/prediction.

The format for input Events and queries is Engine dependent so see the Engine documentation. See the Universal Recommender docs [here](h_ur) 

 - Start the Harness server after the component services like Spark, DBs, etc. For container deployments this Harness is running if the container is live. If you are running the natively installed Harness use `harness stop`
        
 - Create a new Engine Instance and set it's configuration parameters:

        harness-cli add </path/to/some-engine.json>
        # the engine-id in the JSON file will be used for the resource-id
               
 - The end user sends events to the engine-id using the SDK and the engine stores input.    
        
![](https://docs.google.com/drawings/d/e/2PACX-1vQNmHQRJXQq4GAQFxA2_8O4U6_XCXOfFa8i89H0Uyy3SXLo2ePxrnzewJhDW-CanGbz5ivSlo91wcmn/pub?w=1180&h=572)

 - For a Lambda style (batch/background) learner like the UR run:
    
        harness-cli train <some-engine-id>
        # creates or updates the engine's model

    Once the Engine Instance has input it can be trained at any time without disrupting input or queries. This is done by scheduling the "training" task. Since `train` is both a CLI and REST endpoint it can be scheduled anywhere using a variety of methods, from Kubernetes CRON Jobs to a simple Linux cron job and can be triggered via REST or using the `harness-cli`.
    
    As shown below for the Universal Recommender (Lambda) every training session updates or creates a model. If there is an error during training the old model will be left unaltered so queries are not interrupted even by training errors. 
    
    Training can be considered an independent task from input and queries. Input an Queries come all the time on demands from some online app, training updates the model as desired with no effect on input and queries except creating a more up-to-date model. For the UR and other Lambda Engines there is NO DOWNTIME for the model update. 

![](https://docs.google.com/drawings/d/e/2PACX-1vTU8JJgRzfIawtzJW03SAmaf2lQiaFVbbPox19WJnyefXEmEn-P7ghHWhNZB9OIIL-DIw4oEZsES1Iq/pub?w=1180&h=572)

 - Once the Engine Instance has created or updated its model Harness will respond to queries at any time un affected by the timing of training/updates to the model.

![](https://docs.google.com/drawings/d/e/2PACX-1vS7BAt8974bgFtS0Do0qwn15WhhopBABKcSPVlbe-krMT4Ky49tJQT9OWuq2Zp9KX0JwAResMJshr9O/pub?w=1180&h=572)
    
 - If you wish to **remove all data and model** and the engine to start fresh:

        harness-cli delete <some-engine-id>

 - To bring the server down stop the container or use `harness stop`
        
# Overview

<img src="https://docs.google.com/drawings/d/e/2PACX-1vQg6P3yWo5I4T5iz8pDvMb8tCC9uwDZZpEDyzo4NPjy__zvipELBXNzX9lCREY9846-B-Vs0YctzRFY/pub?w=479&amp;h=183">

Queries require a model, this means at least one training session, from then on the model may be updated at any time and on any schedule.