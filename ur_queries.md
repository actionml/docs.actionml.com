# Queries

The Universal Recommender has a reasonable set of defaults so queries can be very simple or, when the need arises, very flexible. The configuration parameters of the UR control much of what is returned so [see that section](/docs/ur_config) for a description.

## Simple Personalized Query

```
{
  "user": "xyz"
}
```
	    	
This gets all default values from the engine.json and uses only action correlators for the types specified there.

## Simple Similar Items Query

```
{
  "item": "53454543513"   
}
```
	
This returns items that are similar to the query item, and blacklist and backfill are defaulted to what is in the engine.json

## Popular Items

```
{
}
```

This returns only popular items. All returned scores will be 0 but the order will be based on relative popularity. Property-based biases for boosts and filters can also be applied as with any other query. See `algorithms.backfillField` parameters for a discussion of how the ranking of all items is calculated.

## Full Query Parameters

Query fields determine what data is used to match when returning recommendations. Some fields have default values in engine.json and so may never be needed in individual queries. On the other hand all values from engine.json may be overridden or added to in an individual query. The only requirement is that there must be a user or item in every query.

```
{
  "user": "xyz", 
  "userBias": -maxFloat..maxFloat,
  "item": "53454543513", 
  "itemBias": -maxFloat..maxFloat,  
  "num": 4,
  "fields": [
    {
      "name": "fieldname"
      "values": ["fieldValue1", ...],
      "bias": -maxFloat..maxFloat 
    },...
  ]
  "dateRange": {
    "name": "dateFieldname",
    "before": "2015-09-15T11:28:45.114-07:00",
    "after": "2015-08-15T11:28:45.114-07:00"
  },
  "currentDate": "2015-08-15T11:28:45.114-07:00",
  "blacklistItems": ["itemId1", "itemId2", ...]
  "returnSelf": true | false,
}
```

* **user**: optional, contains a unique id for the user. This may be a user not in the **training**: data, so a new or anonymous user who has an anonymous id. All user history captured in near realtime can be used to influence recommendations, there is no need to retrain to enable this.
* **userBias**: optional (use with great care), the amount to favor the user's history in making recommendations. The user may be anonymous as long as the id is unique from any authenticated user. This tells the recommender to return recommendations based on the user's event history. Used for personalized recommendations. Overrides and bias in engine.json.
* **item**: optional, contains the unique item identifier
* **itemBias**: optional (use with great care), the amount to favor similar items in making recommendations. This tells the recommender to return items similar to this the item specified. Use for "people who liked this also liked these". Overrides any bias in engine.json
* **fields**: optional, array of fields values and biases to use in this query. 
	* **name** field name for metadata stored in the EventStore with $set and $unset events.
	* **values** an array on one or more values to use in this query. The values will be looked for in the field name. 
	* **bias** will either boost the importance of this part of the query or use it as a filter. Positive biases are boosts any negative number will filter out any results that do not contain the values in the field name. See **Biases** above.
* **num**: optional max number of recommendations to return. There is no guarantee that this number will be returned for every query. Adding backfill in the engine.json will make it much more likely to return this number of recommendations.
* **blacklistItems**: optional. Unlike the engine.json, which specifies event types this part of the query specifies individual items to remove from returned recommendations. It can be used to remove duplicates when items are already shown in a specific context. This is called anti-flood in recommender use.
* **dateRange** optional, default is not range filter. One of the bound can be omitted but not both. Values for the `before` and `after` are strings in ISO 8601 format. Overrides the **currentDate** if both are in the query.
* **currentDate** optional, must be specified if used. If **dateRange** is included then **currentDate** is ignored.
* **returnSelf**: optional boolean asking to include the item that was part of the query (if there was one) as part of the results. Defaults to false.
 
Defaults are either noted or taken from algorithm values, which themselves may have defaults. This allows very simple queries for the simple, most used cases.
 
The query returns personalized recommendations, similar items, or a mix including backfill. The query itself determines this by supplying item, user, both, or neither. Some examples are:

## Contextual Personalized

```
{
  "user": "xyz",
  "fields": [
    {
      "name": "categories"
      "values": ["series", "mini-series"],
      "bias": -1 // filter out all except 'series' or 'mini-series'
    },{
      "name": "genre",
      "values": ["sci-fi", "detective"]
      "bias": 1.02 // boost/favor recommendations with the 'genre' = 'sci-fi' or 'detective'
    }
  ]
}
```

This returns items based on user "xyz" history filtered by categories and boosted to favor more genre specific items. The values for fields have been attached to items with $set events where the "name" corresponds to a doc field and the "values" correspond to the contents of the field. The "bias" is used to indicate a filter or a boost. For Solr or Elasticsearch the boost is sent as-is to the engine and it's meaning is determined by the engine (Lucene in either case). As always the blacklist and backfill use the defaults in engine.json.

## Date ranges as query filters
When the a date is stored in the items properties it can be used in a date range query. This is most often used by the app server since it may know what the range is, while a client query may only know the current date and so use the "Current Date" filter below.

```
{
  "user": "xyz", 
  "fields": [
    {
      "name": "categories"
      "values": ["series", "mini-series"],
      "bias": -1 }// filter out all except 'series' or 'mini-series'
    },{
      "name": "genre",
      "values": ["sci-fi", "detective"]
      "bias": 1.02 // boost/favor recommendations with the 'genre' = 'sci-fi' or 'detective'
    }
  ],
  "dateRange": {
    "name": "availabledate",
    "before": "2015-08-15T11:28:45.114-07:00",
    "after": "2015-08-20T11:28:45.114-07:00       
  }
}
```
	

Items are assumed to have a field of the same `name` that has a date associated with it using a `$set` event. The query will return only those recommendations where the date field is in reange. Either date bound can be omitted for a on-sided range. The range applies to all returned recommendations, even those for popular items. 	

## Current Date as a query filter
When setting an available date and expire date on **items** you will set the name of the fields to be used in the engine.json `expireDateName` and `availableDateName` params, the current date can be used as a filter, the UR will check that the current date is before the expire date, and after or equal to the available date. If the above fields are defined in engne.json a date must accompany any query since all items are assumed to have this property. When setting these values for item propoerties both must be specified so if a one-sided query is desires set the available date to some time in the past and/or the expire date to sometime far in the future, this guarantees that the item will not be filtered out from one or the other limit. If the available and expire fields are named in the engine.json then the date can be passed in with the query or, if it is absent the current PredictionServer date will be used. 

**Note:** a somewhat hidden effect of this is that if these fields are specified in the engine.json the current date type range filter will apply to **every query made**. It is an easy modification to only apply them to queries that contain the `currentDate` as shown below so ask us if you need it.

```
{
  "user": "xyz", 
  "fields": [
    {
      "name": "categories"
      "values": ["series", "mini-series"],
      "bias": -1 }// filter out all except 'series' or 'mini-series'
    },{
      "name": "genre",
      "values": ["sci-fi", "detective"]
      "bias": 1.02	    }
  ],
  "currentDate": "2015-08-15T11:28:45.114-07:00"  
}
```

## Contextual Personalized with Similar Items

```
{
  "user": "xyz", 
  "userBias": 2, // favor personal recommendations
  "item": "53454543513", // fallback to contextual recommendations
  "fields": [
    {
      "name": "categories"
      "values": ["series", "mini-series"],
      "bias": -1 }// filter out all except 'series' or 'mini-series'
    },{
      "name": "genre",
      "values": ["sci-fi", "detective"]
      "bias": 1.02 // boost/favor recommendations with the 'genre' = 'sci-fi' or 'detective'
    }
  ]
}
```

This returns items based on user xyz history or similar to item 53454543513 but favoring user history recommendations. These are filtered by categories and boosted to favor more genre specific items. 

**Note**:This query should be considered **experimental**. mixing user history with item similarity is possible but may have unexpected results. If you use this you should realize that user and item recommendations may be quite divergent and so mixing the them in query may produce nonsense. Use this only with the engine.json settings for "userbias" and "itembias" to favor one over the other.
