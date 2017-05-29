PredictionIO is a source only release so you will need to build it.

 - **Build PredictionIO** 

    Dowload the latest PredictionIO source tarball from an Apache mirror [here](https://www.apache.org/dyn/closer.cgi/incubator/predictionio/0.11.0-incubating/apache-predictionio-0.11.0-incubating.tar.gz) 

    ```
    $ tar zxvf apache-predictionio-0.11.0-incubating.tar.gz
    $ cd apache-predictionio-0.11.0-incubating
    $ ./make-distribution.sh
    ```
    
    This will create a tarball inside `apache-predictionio-0.11.0-incubating` extract it with 
    
    ```
    tar zxvf PredictionIO-0.11.0-incubating.tar.gz
    ```
    
    We suggest you move the resulting `PredictionIO-0.11.0-incubating` directory
    
    ```
    mv PredictionIO-0.11.0-incubating /opt/pio
    sudo ln -s /opt/PredictionIO-0.11.0-incubating /usr/local/pio
    ```
    
    PredictionIO will not run yet so read on.
    
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

   Source these with 
   
   ```
   . ~/.profile 
   ```
   
   to get changes applied.