# Advanced Tuning
    
## Out of Memory Error

Although it's not really an algorithm tuning issue, it's extremely important&mdash;after all if you can't get `harness-cli train <some-ur-id>` to run, who cares about algorithm tuning?

The primary issue you will run into in getting the Spark based `pio train` working with the UR is in allocating enough memory but not too much. To understand how "standalone" Spark works see the [Apache Spark docs](http://spark.apache.org/). The primary thing to note is that a Spark "Driver" runs inside the Harness process. This Driver controls tasks on a Spark Executor, which run in a Spark Worker. In the default Spark setup there is one Executor per Worker and one Worker per node. This means an Executor per Spark node and a single Driver inside Harness. For a single machine setup both Driver and Executor will draw from the same memory pool. This means we must account for both driver and executor with separate memory allocation since they cannot share the memory.

**Maximum driver memory**: Take the amount of memory on the driver machine and subtract whatever is needed to run everything else that is installed on this machine. What is left over is available for the Spark Driver. For a single machine setup this may be extremely limiting so use a machine with more than 32g of main memory and a single machine setup is not recommended for production usage. 

**Maximum executor memory**: is calculated in the same way as driver memory above, but remember that if driver and executor are running on the same machine they must be treated as separate processes so the driver memory must also be subtracted from the total available along with all other processes. This **maximum executor memory** should never be exceeded in job configuration.

After determining the maximum for driver and executor set these in the [UR config](h_ur_config). When deciding on memory, using the max available gives the best performance but only affects the `hanress-cli train` operation. The rest of Harness needs memory too. The Driver typically needs less memory than a single Executor. If you have a single 20g Executor, you may only need to have 10g for the Driver and adding Executors will not affect the Driver memory needs.

**Actual memory needed** is proportional to the size of the input data and its "density". This is impossible to calculate from the data size alone so some experimentation is required to find optimal settings.

**Out of Memory OOM exceptions**: You will need to give the driver and executor enough memory to run but never exceed the amount available, violating either restrictions may cause an Out of Memory (OOM) Exception. If too much is allocated the OOM comes when a driver or executor tries to allocate more memory than is available after other processes and physical limits are reached. When there is not enough for the data, the OOM comes when the data read into Spark exceeds the amount set by job configuration.

**Allocating Memory for Driver and Executors** Staying under the absolute maximums described above, try increasing amounts of memory until the job runs consistently. The needs may change with an increasing number of users and items and you may wish to add a little extra so you don't have to change this value often. Allocate less to the Driver and more to Executor(s). These setting are in the [UR's config](h_ur_config) in the `sparkConf` section.

## Tuning For Recency of User Intent (Newsy Apps)

In "newsy" applications where an item (article?) has a short lifetime as far as its usefulness to users, you will see conversions on any particular item diminish quite rapidly. This is because some items are only of interest when they are new. The UR allows us to tune several parts of the algorithm to meet this need.

 - **Robust model**: It might be tempting to think a model build only on recent events would be the best thing to do here and that is possible but also somewhat wrong. Older items may still be useful in creation of the UR model since they are still related to newer items and since they will still give information about one user's similarity of taste with another's. So create models with a high number or primary indicator per user, even if you have to use older events. The event age is controlled in `datasource.ttl` setting. Set this to encompass a reasonable number of primary events per user.
 - **Recency of User Intent**: If we have lots of user data, as will be the case with a large `ttl`, we can limit the number of events used to calculate recommendations. This is a separate tuning param from the number used to calculate the model (`ttl`). Set `algorithm.maxQueryEvents` to make the average number of event used, span a "recent" time window. In other words if you want to use, on average, one week of user data to indicate their current interests, then set `maxQueryEvents` to be the average number of events users trigger per week. This will take the most recent events, indicating the user's most recent interests, to use for returning recommendations. This method may be useful in non-newsy apps too but has a default value that works pretty well for ECom.
- **Return Only New-ish Items**: Now that we have a robust large model, and are using only recent user events for recs we may want to guarantee that only new items are returned (this is optional because older items may also be of interest to the user). We do this with a date-based filter. In the UR Config specify a `"dateName": "publishedDate"` and make sure to set this property for every item using the $set event for each item. Then in the **query** specify a date range for acceptable items: 

    ```
    "dateRange"": {
      "name": "publishedDate",
      "beforeDate": tomorrow-date
      "afterDate": some-back-date
    }
    ```
       
## Better Model at the Expense of Training/Query Time

At the core of the Universal Recommender is the "Correlated Cross-Occurrence" algorithm, which creates the model used in making recommendations. The more data you include, the better the model will work but this is true with rapidly diminishing returns. One study of this effect was done by one of the CCO creators [here](https://ssc.io/pdf/rec11-schelter.pdf). This leads us to limit the actual data used to calculate the CCO model by downsampling. This will produce slightly worse results but keep the training time O(n) where n is the number of downsampled interactions used. 

To effectively disable downsampling change `"maxEventsPerEventType": 500` to some very large integer to get all data into the model calculation and `"maxCorrelatorsPerEventType": 50,` to a likewise large number to increase the number stored in the model. Increasing `"maxEventsPerEventType"` will make training slower and increasing `"maxCorrelatorsPerEventType"` will make search engine indexing and queries slower.

If training and query times are not a factor these can safely be increased with little chance of other bad side effects.

## Blacklist

The default `blacklistIndicators` in the engine parameters is the single primary event. This means that if the user took the primary event on an item it will not be returned in recommendations. This is often the right thing to do but there are exceptions.

In some cases an item may be consumed periodically like Clothing, or Food so reminding a user that they like an item may be good. To disable the blacklist set the following `"blacklistIndicators": []`, which means to return all recommendations without restriction. 

It is possible with this setting to get only things the user is already familiar with. Disabling the blacklist may not be the best way to handle this. For instance lets say you have 10 recommendations to show; it might be better to get 9 recommendations (with the blacklist) and put in one item you already know the user prefers from your own data. Any mixing of items the user is familiar with and recommendations can be done as part of the application logic, not implemented by the recommender.

In other cases you may want to be more restrictive and use more than the primary event  to filter out items from recs. Setting to `"blacklistIndicators": ["buy", "view"]` is a good example, where anything the use bought or any item detail page the user viewed will will result in those items not being returned as recommendations.

## Anti Flood

Another case for removing items fro recommendations can be seen from looking at a web page with lots of recommendations in different categories. Think of the Netflix Web UI. If we were to show "your recommendations", and "recommended for you in SciFi", and so on, there is a chance that we will show the same items over and over, effectively waisting screen real-estate. In this case it may be better to avoid repeating recommendations, which would "flood" the page with duplicates. To do this, a list of blacklisted items can be passed in to the query and works only for that query.

For example you might get "your recommendations", then when you ask for "recommended for you in SciFi" you might pass in a blacklist if each item returned in "your recommendations" so as to avoid any duplicates. The **query** parameter to add is `"blacklistItems": ["array", "of", "item-ids"]`

## Date Range Filters

Dates ranges can be attached to items and compared to the current date, or they can be specified in the query and compared to a date attached to items. In either case they are a strict filter so recommendations that do not match will not be returned.

Choose one and only one of the following methods.

### Item Available/Expire Dates

2 dates in a range will be attached to **every** item and checked against the current date or a date passed in with the query. If not in the query the date to check against the item's range is the prediction server date. This mode requires that all items have a upper and lower dates attached to them as a property. It is designed to be something like an "available after" and "expired after". 

**Note: Both dates must** be attached to items or they will not be recommended. To have one-sided filter make the available date some time far in the past and/or the expire date some time in the far future.

**config JSON**

```
    ...
    "expireDateName": "expire",
    "availableDateName": "available",

```

Substitute your own field names. **Both** dates must be set for **every** item with a string property encoded as ISO-8601 dates. **Note:** Other properties are set as *arrays of strings* so dates are the only property that is set as a string like this:

```
{
    "event" : "$set",
    "entityType" : "item",
    "entityId" : "some-item-id",
    "properties" : {
        "expire": "2018-10-05T21:02:49.228Z",
        "available": "2015-10-05T21:02:49.228Z"
    },
    "eventTime" : "2015-10-05T21:02:49.228Z"
}
```

**query**

```
{
    “user”: “some-user-id”, 
    ...
}
```

The server date is then compared to `expire` and `available` for all recommendations, filtering all query results.

### Query Date Range

A "dateRange" can be specified in the query and the recommended items must have a date that lies between the range dates. If items do not have a date property attached to them they will never be returned by a dateRange filtered query.

**Config JSON**

```
    ...
    "dateName": "published",
    ...
```

Substitute your own field name. Remember that all items must have this field or they will never be recommended using a `dateRange` in the query. 

**Set the property**

Set the item with a string property encoded as ISO-8601 dates. **Note:** Other properties are set as *arrays of strings* so dates are the only property that is set as a string like this:

```
{
    "event" : "$set",
    "entityType" : "item",
    "entityId" : "some-item-id",
    "properties" : {
        "published": "2015-10-05T21:02:49.228Z"
    },
    ...
}
```

**Query**

```
{
    “user”: “some-user-id”, 
    "dateRange": {
        "name": "published",
        "beforeDate": "2015-09-15T11:28:45.114-07:00",
        "afterDate": "2015-08-15T11:28:45.114-07:00"
    }
}
```

Both `"beforeDate"` and `"afterDate"` must be specified together so if you want a one-sided query, make one or the other dates far in the past or future. If no `"dateRange"` is used in the query, all recommendations will be returned based on other conditions.

## Mixing Item-similarity and User Recommendations

When showing an item, such as when you are on a detail page of an e-com site, it is common to show "similar items" otherwise know as "people who bought this also bought these". This works for completely anonymous users with no history. But in cases where you do know user history you might want to show personalized recommendations. In fact you might want to show personalized except when you have no user history. It is possible to mix items from both recommendation types by simply passing in a user-id and an item-id to the query. To favor user-based personal recommendations set the **query** param `“itemBias”` to something between 1 and 0, which will disfavor item recommendations. If there are no user recommendations because you have no history for the user then item-similarity based recs will be returned as fallback, and if neither is available popular items will be returned. Likewise if you want to favor item recommendations set `“itemBias”` to something larger than 1. This will boost items-similarity recommendations higher than user-based ones.

## Randomization
Although this is not yet implemented in the UR it is always a good idea to randomize the ranking of recommendations to some small extent. This can be done by returning 40 recs and adding normally distributed random noise to the ranking number then re-ranking by the result. This will make the 40th recommendation sometimes become the 19th (for example) and if you are showing 20 it means that they 40th recommendation will sometimes get a chance at being recommended. If the user picks it, this will be fed back into the next training session and will improve the trained model. If the user doesn't pick it the ranking will not be increased. This technique turns a recommender in to a giant array of "multi-armed-bandits" that show somewhat randomly sampled items and learn which to favor. This is a very important technique for improving recommendations over time and should not be discounted as a fringe method. This should  always be done for all recommender implementations and will be incorporated into the UR in the Universal Recommender v0.4.0 release.

## Controlling The Popularity Model (popModel)

The UR allows all items to be ranked by one of several popularity metrics. The need to rank all items is so popularity will work for all forms of property based boosts and filters. This makes the calculation a fairly heavy weight thing that must be done at training time, not at query time. In other words the popularity ranking is pre-calculated by the time the query is made. It is possible to train on all data at one rate (daily, weekly?) and re-train the popularity model alone on a much more frequent rate (hourly?) if needed. This is to account for rapid recent changes in popularity.

### The Popularity Algorithm Parameters

For the meaning and method for setting these values see the [UR Config](h_ur_config) under `rankings`.
    
### Long Term Popularity

The `"recsModel"` defaults to `"all"` which means to return CCO based recommendations and backfill, if necessary from the type of popularity defined in `"rankings"`. The `"rankings"` defaults to ranking all items by the count of primary indicators/event for all time in the training data. This calculates popularity over the long term.

### Short Term Popularity

Whether popular items are being used to backfill when not enough recommendations are available or if they are being queried for directly all popular items are based on the `rankings.duration`, which defines the period from the current server time to `duration` in the past. Any of the events listed in `indicatorNames` are used in the calculation. For example if the period is an hour set the `"duration": "1 hour"`. The string is parsed by the Scala `Duration` class.

### Finding Trending Items

The `"type": "popular"` means to simply count events for all items from "now" to the `"duration"` into the past. A more sophisticated metric might be how quickly the rate of new events is increasing. This is the change in event count over the change in time, which can be thought of as the velocity of events for the duration. If some items have a rapidly increasing number of events over the last period of time it is said to be "trending". To calculate a trending popularity model change to `"type": "trending"`. This will divide the `"duration"` in 2 creating 2 event counts and calculate the rate of event increase in events for all items. So trending = ((#events in period 1) - (#events in period 1)/change in time), and since the change in time doesn't matter for ranking purposes it is not used in the denominator. Period 1 is the most recent and period 2 is the furthest back in time.

### Finding Hot Items

Taking the trending idea one step further the UR also supports `"type": "hot"`, which calculates how quickly trending items are moving up the list. Think of **hot** and being a measure of acceleration. It catches items that may not be globally popular yet, but are quickly moving up. These items are sometimes said to be "going viral". The actual calculation is is similar to Trending but looks at 3 periods and calculates the increase in trending rather than increase in event counts.

### Popular Items Query

The query of any of the above popModel configurations is the same since they all rank all items. You ask for recommendations but do not specify user or item.

```
{
}
```

This query takes all of the same parameters as any other query so you can use boosts and filters. For instance if you wanted to query for popular items of a certain category, and if you have given items a property from the list `"categories": ["electronics", "accessories", "phones"] The following query would return only popular phones:

```
{
  “rules”: [
    {
      “name”: “categories”
      “values”: [“phones”],
      “bias”: -1
    }
  ]
}
```       
       
The `bias: -1` will turn it into a filter, meaning to return nothing that does not contain the `"categories": ["phones"]` so your results will be the most popular items as specified by the popModel tuning params.

## Setting the `ttl`

The `dataset.ttl` controls the events stored in the dataset. The parameters control cleaning and compaction of the persisted events in the EventServer and will drop events so be careful with it and make backups of the EventServer contents before experimenting with this feature. The default is to use no `eventWindow` so it is safe to ignore until you need to limit the data you are accumulating.

Rules for setting the `ttl` params:

 - More data is usually better, but with diminishing returns. After users start to have something like 500 primary events, or whatever you set for `maxEventsPerEventType` you will not get much benefit from more data. So set the time window to be no larger than whatever supports this.
 - The `ttl` also controls de-duplication, and property change compression, which both will help keep the EventStore well compacted. Even it your `eventWindow: duration` is large, it may be useful to compact the EventStore.

# Picking the Best Tuning Parameters

Several of the methods mentioned above can be tested with cross-validation tests but others cannot. For instance increasing data used in training or queries will almost always increase cross-validation test results but randomizations will almost always decrease scores. Tuning for recency will also decrease cross-validation results. Unfortunately some of these results are known to be contrary to real-world A/B test results, which take precedence. When in doubt try an A/B test.

## Finding the Strongest User Indicators

A great many different things known about the user may reflect on their taste. We have discussed the e-com "buy" and "view" indicators for example. But we don't have to stop there, maybe we know the manufacturer of a purchase, the category of purchase, the search terms the user entered, their gender or location. Intuitively these seem to be possible preference indicators but they also are not likely to be as strong as "buy". 

There may even be cases where we know things that could be considered candidates for the primary indicator/event&mdash;for instance in video recommenders is it better to use the fact that the user started a video, watched 20% of a video or 90%? In point of fact we have seen cases where for a given dataset each of these was strongest and by a significant margin. This is a great case where we use cross-validation testing.

## MAP@k

To determine this we start with a tool for measuring the relative predictive strength of a given indicator type. This, relies on cross-validation tests. Some of the tuning examples above can also be tested this way but others cannot. For instance Randomization will always give lower MAP@k results but also gives lift A/B testing. That said MAP@k is a good way to test predictive strength of indicator types. 

ActionML maintains a repo ([ur-harness-analysis](https://github.com/actionml/ur-harness-analysis)) for MAP@k testing but the tool is meant for Data Scientists who know Python and Spark and is provided as-is with no support.


# Business Rules

It is possible to create flexible business rules with item attributes and query structure. Remembering the UR query [formulation](/docs/ur_queries) with fields that have property names, attribute values, and biases we can build complex business rules.

 * **Bias**: The bias tells the UR to boost (bias > 0), include only (bias < 0) or exclude all (bias = 0). Think of a boost as disfavoring (0 > bias < 1) or favoring (bias > 1) items with certain properties. For boosts the bias value is multiplied times the internal score and items are re-ranked.
 * **ORing Attributes**: In the field description if the values are in a list they are ORed, meaning a hit is any of the attributes and the best hit is all of them.
 * **ANDing Attributes**: If there are multiple fields clauses with the same property name but an array of a single attribute per field the attributes are said to be ANDed. For instance if the bias is -1 and 2 attribute values in 2 fields are specified them no recommendation will be returned that does not both attributes. 

ANDing and ORing is best used when filtering for inclusion or exclusion with a bias <= 0.

**Warning**: it is easily possible with business rules to create queries that return no results. Remember that the restrictions are on the query results not all items so if there are only 4 possible recommendations and you filter 5 ways, the likelihood of getting meaningful results may be small. A good rule of thumb is to use boosts where possible since they do not cause exclusion. If it's ok to return nothing, for instance when none of the recommendations are "in-stock": ["true"], then inclusion or exclusion filters are appropriate. Also if you want all items to be recommendable even if there are no events for some then add a default ranking to all items. This will guarantee the maximum recommendations possible are returned.

