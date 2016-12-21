 
 1. Create folders in `/opt`

    ```
    mkdir /opt/hadoop
    mkdir /opt/spark
    mkdir /opt/elasticsearch
    mkdir /opt/hbase
    chown aml:aml /opt/hadoop
    chown aml:aml /opt/spark
    chown aml:aml /opt/elasticsearch
    chown aml:aml /opt/hbase
    ```
    
2. Inside the `/tmp/downloads` folder, extract all downloaded services.

     ```
     tar -xvfz each-tar-filename
     ```

 3. Move extracted services to their folders.

    ```
    sudo mv /tmp/downloads/hadoop-{{> hdfsversionnum}} /opt/hadoop/
    sudo mv /tmp/downloads/spark-{{> sparkversionnum}} /opt/spark/
    sudo mv /tmp/downloads/elasticsearch-{{> elasticsearchversionnum}} /opt/elasticsearch/
    sudo mv /tmp/downloads/hbase-{{> hbaseversionnum}} /opt/hbase/
    ```

    **Note:** Keep version numbers, if you upgrade or downgrade in the future just create new symlinks.

 4. Symlink Folders
    
    ```
    sudo ln -s /opt/hadoop/hadoop-{{> hdfsversionnum}} /usr/local/hadoop
    sudo ln -s /opt/spark/spark-{{> sparkversionnum}} /usr/local/spark
    sudo ln -s /opt/elasticsearch/elasticsearch-{{> elasticsearchversionnum}} /usr/local/elasticsearch
    sudo ln -s /opt/hbase/hbase-{{> hbaseversionnum}} /usr/local/hbase
    sudo ln -s /home/aml/pio /usr/local/pio
    ```
	
