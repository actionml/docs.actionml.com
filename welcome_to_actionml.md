{{#template name='welcome_to_actionml'}}
# Welcome to ActionML

# Welcome to ActionML

We help people build Machine learning into their Apps. We create the systems, algorithms, and infrastructure to make machine intelligence practical. We help customize or invent what is needed then we maintain open source implementations of it all. Try it and if you need help [contact us](/#contact) us or ask for [community support](https://groups.google.com/forum/#!forum/actionml-user) 

## Algorithms

 - **The Universal Recommender**: Perhaps the most flexible recommender in open source. Implemented as a complete end-to-end integrated system that you can run on premises or we can run it for you. The [Universal Recommender](/docs/universal_recommender) contains a new Correlation Engine approach to ingesting data from many sources and include hybrid content based methods to make recommendations better. It implements personalized user based recommendations, item similarity based recs, and item-set aka shopping-cart recommendations.
  
 - **Behavioral Search**: This algorithm takes in data we know about users, learns what leads to purchases or reads, then hands this data back to you for inclusion in your content index. The augmenting data makes search personalized, which leads to greater user satisfaction as measured by things like sales (Amazon has claimed 3% sales lift for a similar algorithm).
 
 - **Text Classification**: The [text classifier](https://github.com/EmergentOrder/template-scala-probabilistic-classifier-batch-sgd) can be used to take examples of documents that are labeled as class-1 or not and once trained it will predict whether a non-labeled or new document is of class-1 or not. This simple technique is can be quite effective in finding the essence of something represented in text. For instance it can find email interactions that indicate a good sales prospect or find in-house documents that might relate to a particular project. 
 
 - **Spark MLlib Recommenders**: The [Ecom Recommender](https://github.com/PredictionIO/template-scala-parallel-ecommercerecommendation), The [Similar Product](https://github.com/PredictionIO/template-scala-parallel-similarproduct), and the [Complementary Purchase](https://github.com/PredictionIO/template-scala-parallel-complementarypurchase) Recommenders all are supported by ActionML. The Universal Recommenders implements all of these recommendation types in a single engine but there may be cases for using these separate engines based on the Matrix Factorization/ALS algorithm.
 
 - **Lead Scoring**: [This engine](https://github.com/PredictionIO/template-scala-parallel-leadscoring) predicts the likelihood that a user will convert in the current session.
 
 - **Bayesian Bandit**: This template is under development and is used to implement the explore/exploit nature of Multi-armed bandits to find the optimum choice from user behavior. It can take the place of standard A/B testing of site or app changes. It is a streaming/online learner with a very efficient implementation. [Contact us](/#contact) for details.
 
## Machine Learning Libraries

 - **Spark MLlib**: ![image](/docs/spark-mlib-logo.png)Many of our Big Data algorithms are taken from Spark's MLlib then built into our production ready system. This Library supplies the algorithms for classification, single action recommenders, and clustering.

 - **Vowpal Wabbit**: Our Small Data (only requires a single machine) or streaming online learning algorithms come from Vowpal Wabbit, a well respected Machine learning library.
 
 - **Apache Mahout**: ![image](/docs/spark-mlib-logo.png)Mahout Samsara is a reinvention of Mahout as a Big Data "roll your own math and algorithms" engine. Something like R but implemented in Scala as an R-like DSL, which runs on the latest fast execution engines like Spark and Flink. We use and commit to the project, which is at the core of the Universal Recommender.
 
 - **Others**: We are constantly cherry-picking open source for the best new technologies to solve real problems. Describe what you want your app to do and we can help find the right technology. If you have enough data we can implement deep learning models with neural nets from several sources including [Google's TensorFlow](https://www.tensorflow.org/){:target="_blank"}.
 
## PredictionIO

We maintain a fork of PredictionIO with some extra features. We use it to customize solutions and deliver scalable reliable systems. We deliver many of our algorithms as PredictionIO Templates. We also support most standard PIO templates.

For various reasons we recommend you get templates directly from their source on github and install PredictionIO using [these instructions](/docs/install).


{{/template}}
