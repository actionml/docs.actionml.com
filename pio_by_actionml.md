{{#template name='pio_by_actionml'}}
# PredictionIO by ActionML

ActionML maintains an enhanced version of PredictionIO in it's own repo. We released v0.9.6 of the project 3 weeks before Salesforce also released the same version. Since the all-Salesforce group of committers have not merged our changes and since our changes are required for may applications including The Universal Recommender and other AML templates we maintain and are committed to supporting our branch in Open Source for the foreseeable future. This means you, the user, will have to choose the branch you want.

For ActionML's PredictionIO v0.9.6 please follow [these instructions](/docs/install) to install or upgrade. 

## ActionML's PredictionIO v0.9.6

 - Implements the `SelfCleaningDataSource` for the EventStore. This allows any template to specify a moving window of events in time, enable de-duplication of events, and compact $set/$unset property change events (see description below)
 - Implements `NullModel` for templates that do not store models in existing PIO data stores. The Universal Recommender requires this feature since it stores models in Elasticsearch.
 - Does not implement SSL/HTTPS and so operates with all existing SDKs
 - Requires Java 7, but works with Java 8

## Use ActionML's PredictionIO v0.9.6
- you don't want SSL/HTTPS **or** 
- you want [The Universal Recommender](/docs/universal_recommender) v0.3.0+ **or** 
- you want to use the new [SelfCleaningDataSource](/docs/pio_versions) to maintain a fixed duration window of data for apps, aging out old data.

Installation instructions [here](docs/install).

**Note**: ActionML maintains a merged version for people who need SSL and other features of the ActionML v0.9.6 in a branch so contact ActionML on our [Google Group](https://groups.google.com/forum/#!forum/actionml-user) or email [support@actionml.com](mailto:support@actionml.com?subject=Need SSL/HTTPS Version of ActionML's PredictionIO v0.9.6) for instructions.

## Salesforce's PredictionIO v0.9.6

 - Requires java 8
 - Require SSL/HTTPS for pio REST APIs. This make it incompatible with existing code that queries or sends events to the EventServer. It also makes it incompatible with the SDKs which will not operate with this version without changes.

## Use the Salesforce Sponsored PredictionIO v0.9.6

- you need SSL/HTTPS **and** 
- you do not need The Universal Recommender v0.3.0+ **and** 
- you do not use an SDK or are willing to modify the SDK code, use the Salesforce sponsored project on [github](https://github.com/PredictionIO/PredictionIO)
- You have no problem with data accumulating forever in the EventStore for any given "app"


{{/template}}
