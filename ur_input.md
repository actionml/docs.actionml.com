# UR Input

The Universal Recommender input is what are called "events" in PredictionIO nomenclature. This can be thought of as two types:

 1. **User preference indicators** which we'll sometimes call "usage events", though they are not limited to actual events and can be extended to user profile properties and usage context. 
    
    1.1 **Primary event**: This is required for the algorithm. It is a record of the type of thing you want to encourage the user to do&mdash;buy, play, watch, read, etc
    
    1.2 **Secondary events**: These encode anything else we know about the user that we think may be an indicator of taste&mdash;category or genre preference, location, pageviews, location, user profile data, tag preference, likes, follows, shares, even search terms.
    
 2. **Item property changes** to set, change, or unset properties of items. User properties are not supported with property change events only through  preference indicators/usage events.
 
The UR takes in potentially many events. These should be seen as a primary event, which is a very clear indication of a user preference and secondary events that we think may tell us something about user "taste" in some way. The Universal Recommender is built on a distributed Correlated Cross-Occurrence (CCO) Engine, which basically means that it will test every secondary event to make sure that it actually correlates to the primary one and those that do not correlate will have little or no effect on recommendations (though they will make it longer to train and get query results). See ActionML's [Analysis Tools](/docs/ur_advanced_tuning/#mapk) for methods to test event predictiveness.

## Preference Indicators aka Usage Events

Events in PredicitonIO are sent to the EventSever in the following form:

	{
		"event" : "purchase",
		"entityType" : "user",
		"entityId" : "1243617",
		"targetEntityType" : "item",
		"targetEntityId" : "iPad",
		"properties" : {},
		"eventTime" : "2015-10-05T21:02:49.228Z"
	}
	
This is what a "purchase" event looks like. Note that a usage event **always** is from a user and has a user id. Also the "targetEntityType" is always "item". The actual target entity is implied by the event name. So to create a "category-preference" event you would send something like this:

	{
		"event" : "category-preference",
		"entityType" : "user",
		"entityId" : "1243617",
		"targetEntityType" : "item",
		"targetEntityId" : "electronics",
		"properties" : {},
		"eventTime" : "2015-10-05T21:02:49.228Z"
	}
	
This event would be sent when the user clicked on the "electonics" category or perhaps purchased an item that was in the "electronics" category. Note that the "targetEntityType" is always "item".

## Property Change Events

To attach properties to items use a $set event like this:

	{
		"event" : "$set",
		"entityType" : "item",
		"entityId" : "ipad",
		"properties" : {
			"category": ["electronics", "mobile-phones"],
			"expireDate": "2016-10-05T21:02:49.228Z"
		},
		"eventTime" : "2015-10-05T21:02:49.228Z"
	}

	{
		"event":"$set",
		"entityType":"item",
		"entityId":"Mr Robot",
		"properties": {
			"content-type":["tv show"],
			"genres":["suspense","sci-fi", "drama"],
			"actor":["Rami Malek", "Christian Slater"],
			"keywords":["hacker"],
			"first_air_at":["2015"]
		}
		"eventTime" : "2016-10-05T21:02:49.228Z"
	}


Unless a property has a special meaning specified in the engine.json, like date values, the property is assumed to be an array of strings, which act as categorical tags. You can add things like "premium" to the "tier" property then later if the user is a subscriber you can set a filter that allows recommendations from `"tier": ["free", "premium"]` where a non subscriber might only get recommendations for `"tier": ["free"]`. These are passed in to the query using the `"fields"` parameter (see Contextual queries above).

Using properties is how boosts and filters are applied to recommended items. It may seem odd to treat a category as a filter **and** as a secondary event (category-preference) but the two pieces of data are used in quite different ways. As properties they bias the recommendations, when they are events they add to user data that returns recommendations. In other words as properties they work with boost and filter business rules as secondary usage events they show something about user taste to make recommendations better.
