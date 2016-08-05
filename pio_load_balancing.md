{{#template name='pio_load_balancing'}}

# PredictionIO Load Balancing

PredictionIO itself stores no state, it uses distributed services to store all state. That means that so scale it most work is on scaling the component services like HBase or Elasticsearch. Various setup guide describe how to do this.

{{>piosetupguides}}

To scale the rest PredictionIO can be deployed with multiple EventServers and PredictionServers. When put behind a load balancer this allows scaling horizontally.

## Multiple EventServers

Simple install PIO (not the component services, they are already setup) on several hosts. Make sure `pio/conf/pio-env.sh` is setup correctly. If the component services are all up and running then launch the EventServer **on each host** with:
  
    @ nohup pio eventserver &

You should be able to run `pio status` on each EventServer host.

## Multiple PredictionServers

PredictionServers with your engine instance can also be launched on multiple servers but requires an extra step. Once you have built and trained the model on one machine, copy the entire engine/template directory to the other PredictionServer machines, then run `pio deploy ...` Actually the only thing that is used to sync PredictionServers is the auto-generated manifest.json but you'll need the compiled engine code on the other servers so copying the entire directory is required once anyway. 
 
{{/template}}
