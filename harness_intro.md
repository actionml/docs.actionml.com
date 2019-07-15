# The Harness ML/AI Server

Harness is a Modern Server for ML and AI Algorithms. It hosts important ML/AI Engines like the Universal Recommender, Behavioral Search, and others. It has built-in Engines but is also designed to host custom algorithms based on a flexible plugin architecture.

Harness implements a framework of microservices that supply REST API, routing, storage, compute, and query functions in a scalable way allowing the Engine to focus on algorithms.

![image](/docs/images/harness-plugin-engines.svg)

<!--
![image](https://docs.google.com/drawings/d/e/2PACX-1vRJQAxBz0D_V6UgShqQFMlH3UbO1N7voy0wIrVOSTGziv4J78GZ2btEFqkrqFKds7SD51uqVNDntdt-/pub?w=549&h=1326)
-->

# Engines

Harness comes with built-in Engines that implement one broad category of algorithms each. Each are designed to be scalable, modern, leading edge for the category.

## The Universal Recommender

The Universal Recommender (UR) is now a mature and full featured 3rd generation recommender capable of supporting applications from ECommerce to News and all points in-between. The UR is designed to be used in any application that needs to model user preferences to aid in discovery.

## The Contextual Bandit

A/B testing makes the assumption that one answer fits everyone. Although this may be true on average, many applications will benefit from personalizing their presentation to fit the user. The Contextual Bandit (CB) is designed to use multi-armed bandit algorithms to model users choices so presentations can be gradually tuned to the user.

## Personalized Search

If we can recommend based on user behavior we can augment Search indexes with this information. This tunes every user's search to produce Personalized Search results. If you have in-application search, you may want to give user's an experience that is more personalized.

## Custom Engines

Harness has an Engine Plugin Architecture to allow easy hosting of all aspects of custom algorithms. Create your own from the starting "ScaffoldEngine" of <a href="https://github.com/actionml/harness" target="_blank">Harness OSS project</a> or ask ActionML to build one for you.
