# Welcome to ActionML

We help people build Machine learning into their Apps. We create, the systems, algorithms, and infrastructure to make machine intelligence practical. We help customize or invent what is needed then we maintain open source implementations of it all. Try it and if you need help [contact us](/#contact) us or ask for [community support](https://groups.google.com/forum/#!forum/actionml-user) 

## Algorithms

Some work we have done is fairly widely applicable and available as Templates:

 - [**The Universal Recommender**](/docs/ur): Perhaps the most flexible recommender in open source. Implemented as a complete end-to-end integrated system that you can run on premises or we can run it for you. The Universal Recommender contains a new Correlation Engine approach to ingesting data from many sources to make recommendations better. Recommenders print money, in the sense that with existing traffic to your site or app you can expect lift in sales or engagement that will improve margins in measurable ways. Amazon is widely reported to see 30% sales lift from it's pervasive use of recommenders.
 
 - [**Behavioral Search**](/blog/personalized_search): AKA Personalized Search this algorithm takes in data we know about users, learns what leads to purchases or reads, then hands this data back to you for inclusion in your content index. The augmenting data makes search personalized, which leads to greater user satisfaction as measured by sales (Amazon has claimed 3% sales lift for a similar algorithm).
 
Some work is more custom and specific to a particular application like:

 - **Ad or Offer Placement** based on user or user group (segments) behavioral data and ad/off to page content similarity.

 - **Content Categorization** advanced content analysis, clustering via Kmeans, Latent Dirichlet Analysis (LDA), word2vec, and other Natural Language (NLP) techniques.

 - **Automated A/B Testing** using Multi-armed Bandits with Bayesian sampling to converge on the best choice more quickly typical A/B split testing and in a way that is statistically valid. 
 
## PredictionIO

We help maintain Apache PredictionIO. We use it to customize solutions and deliver scalable reliable systems. We often deliver our algorithms as PredictionIO Templates. 

## Operations and DevOps

We can setup clusters where big data is used, operate them through proof of concept and beyond, or hand them off to your in-house operations group. We have a suite of automation tools to bring up VMs install software via containers, and can customize these for your operational needs.

## Machine Learning Libraries

We also construct custom solutions as PIO templates or streaming online learners, when asked. We draw from broad knowledge of many existing libraries that have pre-implemented algorithms, ready for deployment and tuning. 

 - [**Spark MLlib**](http://spark.apache.org/mllib/): Many of our Big Data algorithms are taken from Spark's MLlib then built into our production ready system. This Library supplies the algorithms for classification, single action recommenders, and clustering.

 - [**Vowpal Wabbit**](https://github.com/JohnLangford/vowpal_wabbit/wiki): Some of our streaming online learning algorithms come from Vowpal Wabbit, a well respected Machine learning library.

 - [**Apache Mahout**](http://mahout.apache.org/): Mahout Samsara is a reinvention of Mahout as a Big Data "roll your own math and algorithms" engine. Something like R but implemented in Scala with an R-like DSL. It runs on Spark so the algorithms are automatically scalable and optimized. R is designed for in-memory single machine execution. Mahout-Samsara was designed from the ground up as something that can run in Zeppelin interactively (similar to R or iPython Notebook) but executes on distributed Spark for the ultimate in scalability.
 
 - **Others**: We are constantly cherry-picking open source for the best new technologies to solve real problems. The neural net implementations in [Deeplearning4J](https://deeplearning4j.org/) and [TensorFlow](https://www.tensorflow.org/) are examples of new technology we can tap. Describe what you want your app to do and we can help find the right technology.
 

