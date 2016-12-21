PredictionIO is a source only release so you will need to build it.

 - **Build PredictionIO**

     ```
     git clone https://github.com/apache/incubator-predictionio.git ~/pio
     cd ~/pio
     git checkout master # usually the version you want
     ./make-distribution
     ```
 
 - **Setup Path** for PIO commands. Add PIO to the path by editing your `~/.profile` on the master. Here is an example of the important values I have in the file.

    ```
    # Java
    export JAVA_OPTS="-Xmx4g"
    # You may need to experiment with this setting if you get 
    # "out of memory error"" for the driver, executor memory and 
    # Spark settings can be set in the
    # sparkConf section of engine.json
    
    # Spark
    # this tells PIO which host to use for Spark
    export MASTER=spark://some-master:7077
    export SPARK_HOME=/usr/local/spark
    
    # pio
    export PATH=$PATH:/usr/local/pio/bin:/usr/local/pio
    ```

   Run `. ~/.profile` to get changes applied.