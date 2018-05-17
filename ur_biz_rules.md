# Business Rules

Everyone has seen apps like Amazon and Netflix, which show user recommendations but also may narrow down recommendations to a specific category of genre based on the user's location in the app or to fill a special row in the UI. This is done by applying Business Rules based on item properties. Most recommenders do not have this ability so an app must get many many recommendations then filter the ones that have the wrong properties. This is built into the UR in a most efficiently and simply way.

First the input can be as simple as a "buy" where we know a user-id and an item-id. This is sufficient to make the recommendation, but to use buiness rules we must also set properties for items, like category or genre in this use case. We sent the JSON.

```
{
    "event": "buy",
    "entityType": "user",
    "entityId": "John Doe",
    "targetEntityType": "item",
    "tagetEntityId": "some-item",
    "eventTime": "ISO-encoded-datetime"
}
```

To set the item property so the "some-item" has a category = "Electronics" we send the JSON:    

```
{
    "event": "$set", <-- special reserved event name
    "entityType": "item", <-- must be "item"
    "entityId": "some-item", <-- same type of id as in the "buy"
    "properties": { <-- an object may have several properties
        "category": ["Electronics"], <-- and array allows several categories
    },
    "eventTime": "ISO-encoded-datetime"
}
```

## Inclusion Business Rule

Once the UR has trained on this data a simple query will return recommendations for "John Doe" that are all in the "Electronics" category:

```
{
    "user": "John Doe",
    "fields": [{
        "name": "category",
        "values": ["Electronics"],
        "bias": -1
    }]
}    
```

This is called an *inclusion rule* since no item will be returned as a recommendation unless it includes the correct category. The `"bias": -1` tell the recommender to include no other recommendations.

## Exclusion Business Rule

Imagine that instead of including recs from the "Electronics" category all you want to do is **exclude** "Toys":

```
{
    "user": "John Doe",
    "fields": [{
        "name": "category",
        "values": ["Toys"],
        "bias": 0
    }]
}    
```

This is called an *exclusion rule* since `"bias": 0` excludes matching items.

## Boost Business Rules with Logical ANDs and ORs


Inclusion and exclusion rules are dangerous because they can lead to no recommendations returned. They do not limit items, the limit recommended items so if there is not enough data too return a recommendation with category = "Electronics" while excluding all with category = "Toys" we might use a boost. The `bias` will be > 1.0 for a positive boost and 0 < boost < 1.0 to de-boost or disfavor something by it's properties. 

To boost "Electronics" AND de-boost "Toys" we would send the query:

```
{
    "user": "John Doe",
    "fields": [{
        "name": "category",
        "values": ["Electronics"],
        "bias": 10.0
    }{
        "name": "category",
        "values": ["Toys"],
        "bias": 0.001
    }]
}    
```

This is does 2 things:
 - Any recommendation matching category "Electronics" will have it's score multiplied by 10. This will greatly increase it's rank and may increase it above all other items but if there are no recommendations with category "Electronics" is will still return them.
 - AND if the recommended item matches the category "Toys" is will have it's score multiplied by 0.001 greatly decreasing its overall rank so that it may not be returned with the number of recs requested. 

This query shows how to create queries that will not disqualify all recommendations. You are not guaranteed the recs match "Electronics" and do not match "Toys" but if the rules for matching with `"bias" -1"` and `"bias": 0` would have led to no returns this query will fall back to other items, avoiding no recs at all. Use inclusion and exclusion rules if you know for sure that you don't want non-matching recommendations.

The other thing this does is show how to combine rules. Including 2 rules as different fields will AND them logically. 

If we wanted to include recs from "Electronics" OR "Toys" we would send:  

```
{
    "user": "John Doe",
    "fields": [{
        "name": "category",
        "values": ["Electronics", "Toys"],
        "bias": 10.0
    }]
}    
```

This will boost by 10 the score of any recommended item that matches either category and boost by 20 anything matching both. Give enough possible recommendations this will return recommendations matching both categories if it can.

# WARNING

Business rules can be very effective in broadening recommendations when showing them from several categories. They can be used to exclude items that are not "Available" or "In-stock". But be aware that you are creating a bias in recs. You are bending the rules used to find the best thing for the user. Unless there is a hard rule for not show something, try to use boosts. And when using boosts try to find a prominent place to show un-biased recommendations. That way you are using the rules in such a way that they do not exclude what the recommender thinks are the best items for the user.