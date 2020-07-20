# The Universal Recommender

{{> deprecationblurb}}

The Universal Recommender (UR) is a new type of collaborative filtering recommender based on the Correlated Cross-Occurrence algorithm (CCO), which can use data from a wide variety of user taste indicators. Unlike the matrix factorization embodied in things like MLlib's ALS, The UR's CCO algorithm is able to **ingest any number of user actions, events, profile data, and contextual information**. It then serves results in realtime using realtime user data in a scalable way. It also supports business rules based on filtering and boosting matches in item properties. The UR can therefor be considered a hybrid collaborative filtering and content-based recommender. 

The use of multiple **types** of data fundamentally changes the way a recommender this used and, when employed correctly, will provide a significant increase in quality of recommendations vs. using only one "conversion event". Most recommenders, for instance, can only use one indicator of user taste like a "purchase" event. Using all we know about a user and their context allows us to much better predict their preferences.

Not only does this data give lift to recommendation quality but it allows users who have little or no conversions to get recommendations. Therefore is can be used in places where conversions are not as common. It also allows us to enrich preference indicators by extracting entities for text or learning topics and inferring preferences when users read something from a topic. 

Even though this may sound complex, the Universal Recommender can be used well in most typical cases with no complex setup.

## Quick Start

For the impatient head to the [quickstart](/docs/ur_quickstart) and be aware that the UR requires Apache PredictionIO with Elasticsearch. You are free to pick any backing data store but make sure Elasticsearch is installed.

## Typical Uses:

There is a reason we call this recommender "universal" and it's because of the number of use cases it can be applied to.

* **Personalized Recommendations**: "just for you", when you have user history
* **Similar Item Recommendations**: "people who liked this also like these"
* **Shopping Cart Recommendations**:  more generally item-set recommendations. This can be applied to wishlists, watchlists, likes, any set of items that may go together. Some also call this "complementary purchase" recommendations.
* **Popular Items**: These can even be the primary form of recommendation if desired for some applications since several forms are supported. By default if a user has no recommendations popular items will backfill to achieve the number required.
* **Hybrid Collaborative Filtering and Content-based Recommendations**: since item properties can boost or filter recommendations a smooth blend of usage and content can be achieved.
* **Recommendations with Business Rules**: The UR allows filters and boosts based user-defined properties that can be attached to items. So things like availability, categories, tags, location, or other user-defined properties can be used to rule in or out items to be recommended.

## Simple Configuration

All of the above use cases can be very simple to configure and setup. If you have an E-Commerce application, you may be able to get away with one type of input data and some item properties to get all of the benefits. If you have more complex needs, read the [Use Cases](ur_use_cases.md) section for tips.

## The Correlated Cross-Occurrence Algorithm (CCO)

For most of the history of recommenders the data science could only find ways to use one type in user-preference indicator. To be sure this was one type per application but there is so much more we know from user behavior that was going unused. Correlated Cross-Occurrence (CCO) was developed to discover what behavior of a give user correlated to the type of action you want to recommend. If you want to recommend ***buy***, ***play***, ***watch***, or ***read***, is it possible that other things known about a user correlates to this recommended action&mdash;things like a ***pageview***, a ***like***, a ***category preference***, the ***location*** logged in from, the ***device*** used, item detail ***views***, or ***anything else*** known about the user. Furthermore how would we test for correlation?

Enter the Log-Likelihood Ratio (LLR)&mdash;a probabilistic test for correlation between 2 events. This is super important because there is no linear relationship between the **event-types**. The correlation is at the indiviual user and event level and this is where LLR excels. To illustrate this ask yourself in an E-commerce situation is a product view 1/2 of a buy? You might think so but if the user viewed 2 things and bought one of them the correlation is 100% for one of the views and 0% for the other. So some view data is useful in predicting purchases and others are useless. LLR is a very well respected test for this type of correlation.
