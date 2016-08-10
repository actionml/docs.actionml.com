{{#template name='pio_tricks_and_tips'}}

**PIO tricks**

 - **Spark GUI for completed jobs** To store logs from a completed Spark job so errors can be examined after the job has failed pass in the following params to the Spark job.

       pio train -- --driver-memory 4g \
           --executor-memory 4g \
           --master spark://172.31.24.232:7077 \
           --conf spark.eventLog.enabled=true \
           --conf spark.eventLog.dir=hdfs://172.31.2.118:9000/spark-events

Make sure to create the directory `/spark-events` in HDFS before hand.

{{/template}}