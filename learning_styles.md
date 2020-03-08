# Lambda Learning

Due to the complexity of some Machine Learning Algorithms it is not possible to update their "model" with every input. The Lambda style of learning allows for incremental updates made in the background without interrupting query results or input gathering.

In this style of learning input is gathered either as a batch import of through accumulating realtime input. Queries are only possible after a model is built from the input but thereafter the model may be updated in the background as it becomes available.

**Key Concepts**

 - **time window**: A fixed interval of time, usually "now" back in time some fixed amount. This input data is kept in a store for model building and updates.
 - **dataset**: The *dataset* consists of a *time window* of events This is a moving time window in the sense that now moves forward and the last event is always a fixed time in the past.
 - **model**: The product of an algorithm that uses input data. The purpose of a model is to support queries for Machine Learning results. A result of the query for a recommender is recommendations, for a classifier is the classification of a piece of data. Lambda query results are only as up-to-date as their model, through hybrids are possible like the Universal Recommender which mixes Lambda and Kappa model patterns.
 - **training**: To build a model the Algorithm needs to perform a "train" task. These are done in the background and do not affect input or queries until the new or updated model become activated, at the end of training.


# Kappa Learning

We treat input as a time ordered sequence of events, with source timestamps. These arrive to the learner nearly in order but no effort is paid to enforce the ordering other than time stamping when they arrive to the learner.

Key Concepts:

 - **time window**: A fixed interval of time, usually "now" back in time some fixed amount.
 - **dataset**: The *dataset* consists of a *time window* of events This is a moving time window in the sense that now moves forward and the last event is always a fixed time in the past.
 - **model**: The product of an algorithm that uses input data. The purpose of a model is to support queries for Machine Learning results. The key difference in a Kappa style learner vs Lambda style is that the model is nearly up-to-date in realtime (there may be a small time lag but it is a design point to minimize this).
 - **training**: There is no training task in kappa, model updates are done at input time, like the index in a database.

# Benefits

Neither Kappa nor Lambda should be considered "best". They both have benefits.

 - **Lambda**: For complex model calculations, training on a large batch of data may be much simpler than recalculating with each new event. This style often builds more complex models than are possible with *kappa*.
 - **Kappa**: For cases where it is possible to calculate incremental updates to a model in roughly the same time it takes to receive the next event. With Kappa models, it is often not important to store input in a dataset and there is no explicit "training" task.

# References

Some issues related to digesting data incrementally is discussed here:  [Google Research Paper on "The Dataflow Model"](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43864.pdf)