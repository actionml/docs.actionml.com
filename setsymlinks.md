5.2 Move extracted services to their folders.

	sudo mv /tmp/downloads/hadoop-2.6.2 /opt/hadoop/
	sudo mv /tmp/downloads/spark-1.6.1 /opt/spark/
	sudo mv /tmp/downloads/elasticsearch-1.7.5 /opt/elasticsearch/
	sudo mv /tmp/downloads/hbase-1.2.2 /opt/hbase/

**Note:** Keep version numbers, if you upgrade or downgrade in the future just create new symlinks.

5.3 Symlink Folders

	sudo ln -s /opt/hadoop/hadoop-2.6.2 /usr/local/hadoop
	sudo ln -s /opt/spark/spark-1.6.1 /usr/local/spark
	sudo ln -s /opt/elasticsearch/elasticsearch-1.7.5 /usr/local/elasticsearch
	sudo ln -s /opt/hbase/hbase-1.2.2 /usr/local/hbase
	sudo ln -s /home/aml/pio-aml /usr/local/pio-aml		
