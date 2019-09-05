# Business Rules

Everyone has seen apps like Amazon and Netflix, which show user recommendations but also may narrow down recommendations to a specific category of genre based on the user's location in the app or to fill a special row in the UI. This is done by applying Business Rules based on item properties. 

Most recommenders do not have this ability so an app must get many many recommendations then filter out the ones that have the wrong properties. This feature is built into the UR in a most efficiently and simply way.

First the input can be as simple as a "buy" where we know a user-id and an item-id. This is sufficient to make the recommendation, but to use business rules we must also set properties for items, like category or genre in this use case. We send the reserved `$set` event to do this.
   

```
{
    "event": "$set", // special reserved event name
    "entityType": "item", // must be "item"
    "entityId": "<some-item>", // same type of id as in the primary indicator
    "properties": { // an object may have several properties
        "category": ["Electronics"], // an array allows several categories
    },
    "eventTime": "ISO-encoded-datetime"
}
```

This tells the UR that `some-item` has the property "category" with value "Electronics". Note that the value is an array so many categories can be applied. 

## Inclusion Business Rule

A simple UR query will return recommendations for "John Doe" only return those in the "Electronics" category:

```
{
    "user": "John Doe",
    "rules": [{
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
    "rules": [{
        "name": "category",
        "values": ["Toys"],
        "bias": 0
    }]
}    
```

This is called an *exclusion rule* since `"bias": 0` excludes matching items.

## Business Rules with Logical ANDs and ORs

For inclusion and exclusion we can combine with Ands and Ors. To include only items that are of both category "Electronics" and category "Toys":

```
{
    "user": "John Doe",
    "rules": [{
        "name": "category",
        "values": ["Electronics"],
        "bias": -1
    },{
        "name": "category",
        "values": ["Toys"],
        "bias": -1
    }]
}    
```
To include "Electronics" OR "Toys":

```
{
    "user": "John Doe",
    "rules": [{
        "name": "category",
        "values": ["Electronics", "Toys"],
        "bias": -1
    }]
}    
```

## Boost: When Include or Exclude are not Enough

Inclusion and exclusion rules are dangerous because they can lead to no recommendations returned. If there is not enough data to return a recommendation with category = "Electronics" the no items will be returned. 

To "boost" recommended items set the `bias` > 1.0 to boost or favor recommendations and 0 < boost < 1.0 to de-boost or disfavor. 

To boost "Electronics" AND de-boost "Toys" we would send the query:

```
{
    "user": "John Doe",
    "rules": [{
        "name": "category",
        "values": ["Electronics"],
        "bias": 10.0
    }]
}    
```

Here any recommendation matching category "Electronics" will have its score multiplied by 10. This will greatly increase its rank and may increase it above all other items but if there are no recommendations with category "Electronics" is will still return these other recommendations.

# WARNING

Business rules can be very effective in broadening recommendations when showing them from several categories. They can be used to exclude items that are not "Available" or "In-stock". But be aware that you are creating a bias in recs. You are bending the rules used to find the best thing for the user. Unless there is a hard rule for not show something, try to use boosts. And when using boosts try to find a prominent place to show un-biased recommendations. That way you are using the rules in such a way that they do not exclude what the recommender thinks are the best items for the user.

It is easily possible to put rules that are so restrictive, there will be no increase in conversions. It is also possible to show recommended items that are so out of context that they are of reduced effectiveness. Rules should ideally be monitored or A/B tested. Relying on the "eyeball" test or subjective intuition, is very dangerous.