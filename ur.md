{{#template name='ur'}}
# The Universal Recommender

The Universal Recommender (UR) is a new type of collaborative filtering recommender based on an algorithm that can use data from a wide variety of user taste indicators&mdash;it is called the Correlated Cross-Occurrence algorithm. Unlike the matrix factorization embodied in things like MLlib's ALS, CCO is able to ingest any number of user actions, events, profile data, and contextual information. It then serves results in a fast and scalable way. It also supports item properties for filtering and boosting recommendations and can therefor be considered a hybrid collaborative filtering and content-based recommender. 

The use of multiple **types** of data fundamentally changes the way a recommender is used and, when employed correctly, will provide a significant increase in quality of recommendations vs. using only one user event. Most recommenders, for instance, can only use "purchase" events. Using all we know about a user and their context allows us to much better predict their preferences.

##Quick Start

For the impatient head to the [quickstart](/docs/ur_quickstart) and be aware that the UR requires the ActionML version of PIO with Elasticsearch. You are free to pick and backing data store.

## The Correlated Cross-Occurrence Engine

For most of the history of recommenders the data science could only find ways to use one type in user-preference indicator. To be sure this was one type per application but there is so much more we know from user behavior that was going unused. Correlated Cross-Occurrence (CCO) was developed to discover what behavior of a give user correlated to the type of action you want to recommend. If you want to recommend ***buy***, ***play***, ***watch***, or ***read***, is it possible that other things known about a user correlates to this recommended action&mdash;things like a ***pageview***, a ***like***, a ***category preference***, the ***location*** logged in from, the ***device*** used, item detail ***views***, or ***anything else*** known about the user. Furthermore how would we test for correlation?

Enter the Log-Likelihood Ratio (LLR)&mdash;a probabilistic test for correlation between 2 events. This is super important because there is no linear relationship between the **event-types**. The correlation is at the indiviual user and event level and this is where LLR excels. To illustrate this ask yourself in an E-commerce situation is a product view 1/2 of a buy? You might think so but if the user viewed 2 things and bought one of them the correlation is 100% for one of the views and 0% for the other. So some view data is useful in predicting purchases and others are useless. LLR is a very well respected test for this type of correlation. 

## Typical Uses:

There is a reason we call this recommender "universal" and it's because of the number of use cases it can be applied to.

* **Personalized Recommendations**: "just for you", when you have user history
* **Similar Item Recommendations**: "people who liked this also like these"
* **Shopping Cart Recommendations**:  more generally item-set recommendations. This can be applied to wishlists, watchlists, likes, any set of items that may go together. Some also call this "complimentary purchase" recommendations.
* **Popular Items**: These can even be the primary form of recommendation if desired for some applications since serveral forms are supported. By default if a user has no recommendations popular items will backfill to achieve the number required.
* **Hybrid Collaborative Filtering and Content-based Recommendations**: since item properties can boost or filter recommendations and can often also be treated as secondary user preference data a smooth blend of usage and content can be achieved. 

{{/template}}