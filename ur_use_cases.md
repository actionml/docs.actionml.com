# Use Cases

Your data drives recommendations. Not all data is created equal. This means you may need to adapt the Universal Recommender to your Use Case. The UR is made with realistic default setting that have been learned from many deployments but that means they are tuned to a good amount of data. Practically speaking that means many users (>10,000) and many items (>2000). Fundamentally a recommender uses the fact that you have similar taste to other users. This means that it needs to have 5-20 conversion items per average user, in other words 5-20 items purchased or read or watched or listened to. 

If your data differs from this ideal do not despair we can often tune or use the UR in ways that will provide lift in conversions by accounting for your special Use Case.

## 1. Not Enough Data

The Universal Recommender is what we call "multi-modal" meaning it allows us to record and use multiple types of input data including item metadata as well as many user actions. As long as enough users have 5-20 conversion items we may be able to make good personalized recs by using more types of data. This (along with [Business Rules](ur_bix_rules.md)) is one of the unique powers of the UR. 

We have done experiments that show large improvements in quality of recommendations by using these "secondary indicators". One study we did used "likes" of movies as the conversion and "dislikes" of movies as the "secondary indicator". Using the 2 together gave us a lift or increase of 20% in quality. See the study in the IBM Dev-Works Blog Post; [How to Make One Thing Predict Another](https://developer.ibm.com/dwblog/2017/mahout-spark-correlated-cross-occurences/). We also combined item metadata wit likes and dislikes to get another 6% lift for a total of 26%. This is above using only conversions/likes.

### Adding Secondary Indicators

If you have only a small number of conversions but enough people that have 5-20 conversions you will likely increase performance for those less active people by learning more about them and doing that with secondary indiczators. Enough is active people is impossible to judge before you look at cross-validation results but we'll talk about that elsewhere. This translates to the fact that we can use more data than other recommenders (Factorization/ALS recommenders can only use one data type) to improve performance, even if the data is good without it. For instance you record:


The trick to encoding the secondary indicator data only requires that you think in terms of, "what does the data say about the user?" In other words we will always tie the data to a user-id. We will think about the indicators as (user-id, indictor-name, id-of-indicator-item) Using PredictionIO or Harness requires that all input indicators be encoded in JSON of the form:

```
{
    "event": "buy",               <-- indicator name
    "entityType": "user",         <-- always "user"
    "entityId": "John Doe",       <-- user-id
    "targetEntityType": "item",   <-- always "item"
    "tagetEntityId": "some-item", <-- the target item id for this indicator
    "eventTime": "ISO-encoded-datetime"
}
```

The only things that will change in this encoding are (user-id, indictor-name, id-of-indicator-item) as well as the datetime of the event.

### Extra User Behavior

 - item detail views? For example a user views a product page.
 - search terms? Yes, even the terms a user searches for can be used, sometimes to significant effect.

So to create a "search-pref" indicator we encode:

```
{
    "event": "search-pref",       <-- indicator name = search-pref
    "entityType": "user",         <-- always "user"
    "entityId": "John Doe",       <-- user-id
    "targetEntityType": "item",   <-- always "item"
    "tagetEntityId": "iPhone X",  <-- the target item id for this indicator
    "eventTime": "ISO-encoded-datetime"
}
```

This means the user searched for "iPhone X", nothing more. The UR will see if this fact correlated with any conversions and use this search from others to indicate a likelihood to convert on those correlated items. One is likely to be an "iPhone X" but maybe of a certain color or maybe other products. This technique may work for any type of conversion, not just E-Commerce. For instance the searches have been found to be good indicators for music.

Likewise anything the user does can be encoded as a secondary indictor. It may be a bit harder to wrap your mind around metadata as an indicator but the way to think about it is that when a use converts on an item, they may be expressing a preference for the items brand, category, genre, cast member, music properties, entities mentioned in the article, on-and-on. 

### Item Metadata
 
 - metadata? This is not obvious perhaps but the attributes of an item may tell us something about user preferences. For instance in E-Com a brand, category, price-range&mdash;for videos this might be genre, format, language, cast members, or directors. These are not just item properties, they may also tell us that a user like Marvel superhero movies, or Apple products. You may want to use these in business rules but also think about using them as preference indicators about the user. We often use "metadata-pref" indicators to correlate with conversions and get lift.

The other thing to get your mind around is that the indicator is **triggered** by a conversion since there may be no action that corresponds with a metadata-pref. So in Video recommending, when a user watches a video we may also encode the genre and send the 2 JSON events at the same time.

```
{
    "event": "watch",                <-- indicator name = watch
    "entityType": "user",            <-- always "user"
    "entityId": "John Doe",          <-- user-id
    "targetEntityType": "item",      <-- always "item"
    "tagetEntityId": "Infinity War", <-- the target item id for this indicator
    "eventTime": "ISO-encoded-datetime"
}

{
    "event": "metadata-pref",       <-- indicator name = metadata-pref
    "entityType": "user",           <-- always "user"
    "entityId": "John Doe",         <-- user-id
    "targetEntityType": "item",     <-- always "item"
    "tagetEntityId": "Super Heros", <-- the target item id for this genre
    "eventTime": "ISO-encoded-datetime"
}
```

The conversion may trigger many secondary indicators along with the primary "watch" conversion indicator in this video example. For E-Com the brand or category might be triggered similarly. 

Each type of metadata can be processed separately (brand-pref, genre-pref, cast-pref, category-pref, etc) but this requires tuning separately so lumping all metadata together into one event name might be expedient. 

### Contextual Data

Contextual data comes in many forms and is useful in certain use cases but not as often as metadata and secondary actions. Still for time sensitive recommendations, or recs with a strong correlation to location or the device that triggered the conversion, the data may be useful. 
 
 - time-of-day? When a user converted, what hour of the day was it? For certain data this might be informative--video watches sometimes are correlated to time-of-day.
 - day-of-week? Again this may be useful with your data
 - what device were they using when converting
 - location where were the user watched or read? When doing a News recommender we found location while reading was important enough to make a significant difference.

Like metadata preferences these are usually triggered when a conversion happens and tell us something about the context that might have led to a conversion. This will cause several events set at one time, the conversion and the contextual indicators. 

```
{
    "event": "read",                   <-- indicator name = read
    "entityType": "user",              <-- always "user"
    "entityId": "John Doe",            <-- user-id
    "targetEntityType": "item",        <-- always "item"
    "tagetEntityId": "Boston Bombing", <-- the item id read
    "eventTime": "ISO-encoded-datetime"
}

{
    "event": "location-pref",   <-- indicator name = location-pref
    "entityType": "user",       <-- always "user"
    "entityId": "John Doe",     <-- user-id
    "targetEntityType": "item", <-- always "item"
    "tagetEntityId": "Boston",  <-- where the user was when they read about 
                                    the "Boston Bombing"
    "eventTime": "ISO-encoded-datetime"
}
```

Not that unless the number of locations we record is nearly the same as the number of conversion item-ids, special tuning is required for these.

### Special Tuning for Some Secondary Indicators

For reasons to do with the internal math of the Universal Recommender we use pre-tuned thresholds to work with typical data. This work quite well if there are many users and many items and at least 5-20 conversions per user. 

The opposite extreme can be illustrated in the case of gender where there are only 2 possible values for an indicator. The most traditional indicator for gender can only take the value of male or female (political correctness aside). If we use gender as an indicator we might have all items with both values correlated to conversions. This would then have no information since whether the user is male or female they would get the same recommendations. Yet we know with some certainty that gender preferences do exist.

The way to solve this is to tune the correlation threshold to be the right value to give us only the highest correlation values from all users for all items. This is done by setting the `minLLR` indictor threshold in the `engine.json` params for the `gender` indicator.

ActionML finds the best `minLLR` with tools that find the threshold that give best indicator matrix density and this requires we use cross-validation tests for "best". This is done with custom tools we employ. The tools are free OSS on our GitHub repository but are unsupported because they are a bit complicated to use. If you need help contact us for custom support.

### Why "More Data" Helps

Even in cases where we have only a few active users with 5-s0 conversions we may be able to calculate secondary indicators that in combination are strong enough to make good recommendations. For instance imagine a new user which is on a shopping trip for a video to watch. They have not watched a single one yet. Most recommenders would be unable to recommend. But this user has browsed to several titles, searched, and watched some trailers. This may well give us enough to make recommendations if these have been recorded for many other users. So while a uni-modal recommender fails The Universal recommender helps the new user with their video shopping trip.

## 2. Newsy Content aka Items with a Short Lifetime

Some use cases, we'll use "newsy" content as an example, has content that is created and retired quickly. An internet meme site might have many bloggers covering internet or cultural memes that come and go in days. The subjects they cover may be "old news" pretty quickly. This means that we have only a few days to recommend them before they become irrelevant. We also only have a limited number of user that read any one article.

This situation can be quite problematic if we didn't stand back and realize that, yes we have a data gathering problem but that doesn't change the fact that people have long lived interest in subjects. When I go to a meme site I'm a sucker for the pet memes. Cats and cucumbers, Lil-bub, on-and-on. With the UR we can make use of this long lived nature of user's taste even if the memes or articles are of short lived interest. We do this by adding in data about the part of the article that relates to long lived interests. 

News adds many of these longer lived metadata indicators. With news we often know the entities they cover, their subject matter, keywords, tags, the location covered, etc. And it we don't there are good techniques in Machine learning to extract them from the content.

This is the converse of the new user problem, it more the new item problem. Items for Newsy applications are always new but the entities or subjects they cover aren't. For instance I am also interested in Cosmology and Theoretical Physics so a News site will have recorded this in my metadata-prefs of the past. Now when a new article comes in about the Space-X launch of the new Planet finder satellite TESS, they would do well to highlight it for me. Too bad most new sites have given up on recommenders because of the unhelpful uni-modal ones of the past.