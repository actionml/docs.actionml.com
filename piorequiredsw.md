We will install the following requirements:

- Hadoop {{> hdfsversion}} (Clustered, standby master needed for full HA)
- Spark {{> sparkversion}} (Clustered)
- Elasticsearch {{> elasticsearchversion}} (Clustered, standby master)
- HBase {{> hbaseversion}} (Clustered, standby master)
- Universal Recommender [here](/docs/ur_quickstart)
- 'Nix server, some instructions below are specific to Ubuntu, a Debian derivative and Mac OS X. Using Windows is supported only with a VM running some `nix OS.