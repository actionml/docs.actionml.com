# PredictionIO Load Balancing

PredictionIO itself stores no state, it uses distributed services to store all state. That means that to scale most work you will scale the component services like HBase or Elasticsearch. Various setup guides describe how to do this.

{{>piosetupguides}}

PredictionIO itself can be deployed with multiple EventServers and PredictionServers. When put behind a load balancer this allows scaling horizontally. 

**Note**: this is very seldom needed unless PredictionIO is business critical and in need of High Availability because when running PIO in production it is only a thin layer which has been able to handle very high demand deployments with one machine for both Event and Prediction Server. 

## Multiple EventServers

Simply install PIO (not the component services, they are already setup) on several hosts. Make sure `pio/conf/pio-env.sh` is setup correctly. If the component services are all up and running then launch the EventServer **on each host** with:

```  
nohup pio eventserver &
```

You should be able to run `pio status` on each EventServer host.

## Multiple PredictionServers

PredictionServers with your engine instance can also be launched on multiple servers but requires an extra step. Once you have built and trained the model on one machine, copy the entire template directory to the other PredictionServer machines, then run `pio deploy ...` 

Make sure that all code, config and the auto-generated manifest.json are identical on all PredictionServe machines including the path to the engine code jar file.

**Note**: if you get the dreaded `one-for-one` error when running `pio deploy` make sure that the path to the jar is the same as on the machine you ran `pio train` and check that the contents of `template-dir/manifest.json` is the same too. 
