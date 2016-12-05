# PredictionIO by ActionML

ActionML maintains an enhanced version of PredictionIO in our own repo. Since our changes are required for our own templates, including The Universal Recommender, we maintain and are committed to supporting our branch in Open Source for the foreseeable future. This means you, the user, will have to choose the branch you want.

For ActionML's PredictionIO {{> pioversion}} please follow [these instructions](/docs/install) to install or upgrade. 

## ActionML's PredictionIO {{> pioversion}}

 - {{> pioversion}} implements the `SelfCleaningDataSource` for the EventStore. This allows any template to specify a moving window of events in time, enable de-duplication of events, and compact $set/$unset property change events (see description below)
 - Implements `NullModel` for templates that do not store models in existing PIO data stores. The Universal Recommender requires this feature since it stores models in Elasticsearch.
 - Does not implement SSL/HTTPS and so operates with all existing SDKs
 - Requires Java 7, but works with Java 8

## Use ActionML's PredictionIO {{> pioversion}}

- you don't want SSL/HTTPS **or** 
- you want [The Universal Recommender](/docs/ur) v0.3.0+ **or** 
- you want to use the new [SelfCleaningDataSource](/docs/pio_versions) to maintain a fixed duration window of data for apps, aging out old data.

Installation instructions [here](install).

**Note**: ActionML maintains a merged version for people who need SSL and other features of the ActionML {{> pioversion}} in a branch so contact ActionML on our [Google Group](https://groups.google.com/forum/#!forum/actionml-user) or email [support@actionml.com](mailto:support@actionml.com?subject=Need SSL/HTTPS Version of ActionML's PredictionIO v0.9.6) for instructions.

## Salesforce's PredictionIO v0.9.6

 - Requires java 8
 - Require SSL/HTTPS for pio REST APIs. This make it incompatible with existing code that queries or sends events to the EventServer. It also makes it incompatible with the SDKs which will not operate with this version.

## Use the Salesforce Sponsored PredictionIO v0.9.6

- you need SSL/HTTPS **and** 
- you do not need The Universal Recommender v0.3.0+ **and** 
- you do not need to trim old events or compact duplicates and property change events **and**
- you do not use an SDK or are willing to modify the SDK code, use the Salesforce sponsored project on [github](https://github.com/PredictionIO/PredictionIO)
