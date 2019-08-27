# The Universal Recommender

The Universal Recommender (UR) is a new type of collaborative filtering recommender based on the Correlated Cross-Occurrence algorithm (CCO), which can use data from a wide variety of sources to tune and make recommendations better. 

Unlike the older style matrix factorization embodied in things like MLlib's ALS, The UR's CCO algorithm is able to **ingest any number of user actions, events, profile data, and contextual information**. It then serves results in realtime using realtime user data in a scalable way. It also supports business rules that filter and boost based on item properties. The UR can therefor be considered a hybrid collaborative filtering and content-based recommender. 

The use of multiple **types** of data fundamentally changes the way a recommender is used and, when employed correctly, will provide a significant increase in quality of recommendations vs. using only one "conversion event". Most recommenders can only use one indicator of user taste like a "purchase" event. Using all we know about a user and their context allows us to much better predict their preferences.

Not only does this data give lift to recommendation quality but it allows users who have little or no conversions to get recommendations. Therefore is can be used in places where conversions are not as common. We can also enrich preference indicators by extracting entities for text or learning topics and inferring preferences when users read something from a topic. 

Even though this may sound complex, the Universal Recommender can be used well in most typical cases with no complex setup.

## Quick Start

The Universal Recommender is installed with Harness. See the [one-line install here](harness_container_guide).

For the impatient head to the [quickstart](/docs/h_ur_quickstart)

## Typical Uses:

There is a reason we call this recommender "universal" and it's because of the number of use cases it can be applied to.

* **Personalized Recommendations**: "just for you", when you have user history
* **Similar Item Recommendations**: "people who liked this also like these"
* **Shopping Cart** or **Complementary Items Recommendations**:  more generally item-set recommendations. These can be used with shopping carts, wishlists, watchlists, likes, any set of items that may go together.
* **Popular Items**: By default if a user has no recommendations popular items will backfill to achieve the number required. Based on the query these can also be retrieved instead on other types of recommendations. Many methods for calculating "popular" are supported.
* **Hybrid Collaborative Filtering and Content-based Recommendations**: since item properties can boost or filter recommendations a smooth blend of usage and content can be achieved.
* **Recommendations with Business Rules**: The UR allows filters and boosts based on properties attached to items. So things like availability, categories, tags, location, or other custom properties can be used to rule in or out items to be recommended.

## Simple Configuration

All of the above use cases can be very simple to configure and setup. If you have an E-Commerce application, you may be able to get away with one type of input data and some item properties to get all of the benefits. If you have more complex needs, read the [Use Cases](ur_use_cases.md) section for tips.

## The Correlated Cross-Occurrence Algorithm (CCO)

For most of the history of recommenders the data science could only find ways to use one type in user-preference indicator. So much we knew from user behavior was going unused. Correlated Cross-Occurrence (CCO) was developed to account for all this data and apply it to a deeper understanding of user preferences. If you want to recommend ***buy***, ***play***, ***watch***, or ***read***, is it possible that other behavior of the user  correlates to this recommended action&mdash;things like a ***pageview***, ***like***, ***category preference***, ***user location***, ***device used***, ***item detail views***, ***anything else*** known about the user.

CCO finds correlating data for conversion data. It picks behavior that correlates with conversions by item-ids&mdash;so it finds, for example, if a device being used correlates to preference for an item, or if user location correlates with preference for an item. It can even find if dislikes correlate with likes. All this data can now be brought to bear upon making better more sensitive recommendations.
