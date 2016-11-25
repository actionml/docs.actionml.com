DocList = [
    {
        title: 'Welcome to ActionML',
        template: 'welcome_to_actionml',
        sections: []
    },
    {
        title: 'PredictionIO',
        template: 'pio_by_actionml',
        sections: [
            {
                title: 'Quickstart',
                template: 'pio_quickstart'
            },
            {
                title: 'Upgrading',
                template: 'install'
            },
            {
                title: 'Architecure and Workflow',
                template: 'pio_architecture'
            },
            {
                title: 'AWS AMI  Setup',
                template: 'awssetupguide'
            },
            {
                title: 'Single Machine Setup',
                template: 'single_machine'
            },
            {
                title: 'Small HA Cluster',
                template: 'small_ha_cluster'
            },
            {
                title: 'Distributed Cluster',
                template: 'single_driver_machine'
            },
            {
                title: 'Cheatsheet',
                template: 'pio_cli_cheatsheet'
            },
            {
                title: 'Start/Stop PIO',
                template: 'pio_start_stop'
            },
            {
                title: 'Version History',
                template: 'pio_versions'
            }
        ]
    },
    {
        title: 'The Universal Recommender',
        template: 'ur',
        sections: [
            {
                title: 'Quickstart',
                template: 'ur_quickstart'
            },
            {
                title: 'Configuration',
                template: 'ur_config'
            },
            {
                title: 'Input',
                template: 'ur_input'
            },
            {
                title: 'Queries',
                template: 'ur_queries'
            },
            {
                title: 'Advanced Tuning',
                template: 'ur_advanced_tuning'
            },
            {
                title: 'Model Debugging',
                template: 'ur_elasticsearch_debugging'
            }
        ]
    }
];

DocsHtmlPartials = [
  {
    name: "pioname",
    template: "PredictionIO-{{ pioversionnum}}",
    ismd: false
  },
  {
    name: "pioversion",
    template: "v{{ pioversionnum}}",
    ismd: false
  },
  {
    name: "pioversionnum",
    template: "0.9.7-aml",
    ismd: false
  },
  {
    name: "urversion",
    template: "v0.3.0",
    ismd: false
  },
  {
    name: "hdfsversion",
    template: "v{{hdfsversionnum}}",
    ismd: false
  },
  {
    name: "sparkversion",
    template: "v{{ sparkversionnum}}",
    ismd: false
  },
  {
    name: "elasticsearchversion",
    template: "v{{ elasticsearchversionnum}}",
    ismd: false
  },
  {
    name: "hbaseversion",
    template: "v{{ hbaseversionnum}}",
    ismd: false
  },
  {
    name: "hdfsversionnum",
    template: "2.7.2",
    ismd: false
  },
  {
    name: "sparkversionnum",
    template: "1.6.2",
    ismd: false
  },
  {
    name: "elasticsearchversionnum",
    template: "1.7.5",
    ismd: false
  },
  {
    name: "hbaseversionnum",
    template: "1.2.1",
    ismd: false
  },
  {
    name: "hdfsdownload",
    template: "<a href='http://www.eu.apache.org/dist/hadoop/common/hadoop-2.7.2/hadoop-2.7.2.tar.gz'>Hadoop 2.7.2</a>",
    ismd: false
  },
  {
    name: "sparkdownload",
    template: "<a href='http://www.us.apache.org/dist/spark/spark-1.6.2/spark-1.6.2-bin-hadoop2.6.tgz'>Spark 1.6.2</a>",
    ismd: false
  },
  {
    name: "esdownload",
    template: "<a href='https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-1.7.5.tar.gz'>Elasticsearch 1.7.5</a>",
    ismd: false
  },
  {
    name: "hbasedownload",
    template: "<a href='http://www-us.apache.org/dist/hbase/1.2.2/hbase-1.2.2-bin.tar.gz'>HBase 1.2.2</a>",
    ismd: false
  },
  {
    name: 'pio_version',
    template: 'PredictionIO-v0.9.7-aml',
    ismd: true
  },
  {
    name: "piosinglemachineguide",
    template: "- **[Single Machine](/docs/single_machine)**: This sets up a single machine to run all services but does so in a way that allows for easier cluster expansion in the future.",
    ismd: true
  },
  {
    name: "piosmallhaguide",
    template: "- **[Small High Availability Cluster](/docs/small_ha_cluster)**: This sets up a 3 machine cluster with all services running on all machines with no single point of failure. This setup will allow you to expand by moving clustered services into their own cluster as needed. For instance Spark may be moved to separate machines for scaling purposes. ",
    ismd: true
  },
  {
    name: "piodistributedguide",
    template: "- **[Fully Distributed Clusters](/docs/single_driver_machine)**: This creates a 'Driver' machine that can run PIO when all services are in external clusters. This represents the ultimate in scalability since the clusters can be scaled independently.",
    ismd: true
  }
]
