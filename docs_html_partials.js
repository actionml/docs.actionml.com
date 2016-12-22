DocsHtmlPartials = [
  {
    name: "pioname",
    template: "PredictionIO-{{> pioversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "pioversion",
    template: "{{> pioversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "pioversionnum",
    template: "0.10.0-incubating",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "urversion",
    template: "v{{> urversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "urversionnum",
    template: "0.5.0",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hdfsversion",
    template: "{{> hdfsversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "sparkversion",
    template: "{{> sparkversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "elasticsearchversion",
    template: "{{> elasticsearchversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hbaseversion",
    template: "{{> hbaseversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hdfsversionnum",
    template: "2.7.2",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "sparkversionnum",
    template: "1.6.3",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "elasticsearchversionnum",
    template: "1.7.5",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hbaseversionnum",
    template: "1.2.4",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hdfsdownload",
    template: "<a href='http://www.eu.apache.org/dist/hadoop/common/hadoop-2.7.2/hadoop-2.7.2.tar.gz'>Hadoop 2.7.2</a>",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "sparkdownload",
    template: "<a href='http://www.us.apache.org/dist/spark/spark-1.6.3/spark-1.6.3-bin-hadoop2.6.tgz'>Spark 1.6.3</a>",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "esdownload",
    template: "<a href='https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-1.7.5.tar.gz'>Elasticsearch 1.7.5</a>",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hbasedownload",
    template: "<a href='http://www-us.apache.org/dist/hbase/1.2.4/hbase-1.2.4-bin.tar.gz'>HBase 1.2.4</a>",
    ismd: false,
    shouldLoad: false
  },
  {
    name: 'pio_version',
    template: 'PredictionIO-v0.10.0-incubating',
    ismd: true,
    shouldLoad: false
  },
  {
    name: "piosinglemachineguide",
    template: "- **[Single Machine](/docs/single_machine)**: This sets up a single machine to run all services but does so in a way that allows for easier cluster expansion in the future.",
    ismd: true,
    shouldLoad: false
  },
  {
    name: "piosmallhaguide",
    template: "- **[Small High Availability Cluster](/docs/small_ha_cluster)**: This sets up a 3 machine cluster with all services running on all machines with no single point of failure. This setup will allow you to expand by moving clustered services into their own cluster as needed. For instance Spark may be moved to separate machines for scaling purposes. ",
    ismd: true,
    shouldLoad: false
  },
  {
    name: "piodistributedguide",
    template: "- **[Fully Distributed Clusters](/docs/single_driver_machine)**: This creates a 'Driver' machine that can run PIO when all services are in external clusters. The driver machine also runs the Spark Driver and so must be as big as any Spark Worker machine, which are in an external stanalone Spark cluster. This allows the service clusters to be scaled independently.",
    ismd: true,
    shouldLoad: false
  },
  {
    name: "awssetupguide",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "pioawsguide",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "piosetupguides",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "setsymlinks",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "piorequiredsw",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "setupjava18",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "installservices",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "setupuser",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "intro_to_spark",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "build_pio",
    template: "",
    ismd: true,
    shouldLoad: true
  }
]
