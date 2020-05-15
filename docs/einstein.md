# Einstein

Einstein is an incredibly powerful and broad platform and covering all of the functionality of the platform is well beyond the scope of this documentation. What is below is meant to serve as a helpful high level guide to Einstein but, by no means, should this be considered comprehensive.

## Overview

If you're familiar with Einstein, here's a high level overview of what you'll need to do within the platform in order to use TabStein.

1. Create a new data set and load data
2. Create a story that uses predictive
3. Optionally, correct any issues/address any recommendations
4. Deploy your model

If you're not a total Einstein pro, read on. Additional info on each of these steps is below.

## Creating a Data Set / Loading Data

Einstein supports a number of native connectors but I've not actually used any of the native connectors. Not because they aren't worth using, but because, well, I'm just lazy like that I suppose. In any case, if you are using an enterprise DB-type of system, you should check to see if you can just connect natively because I'm sure that would be much more pleasant than my approach.

Yes, it's true, I've always just loaded a CSV to Einstein. I admit it and, yes, I'm ashamed. But it was just the path of least resistance, you gotta believe me! Seriously, if you aren't looking to load a ginormous data set to Einstein, the CSV upload is a pretty solid option.

## Creating a Story

Stories are the centerpiece of Einstein. This is where you get all the statistical magic from your data. A story in Einstein involves minimizing or maximizing (your choice) a binary column _or_ a continuous numeric column from your dataset. So, what you are going to minimize or maximize needs to be either a column that has two possible options (binary) or needs to be a number that could (in theory at least) be valued between negative infinity and positive infinity (that means all the numbers, yep, all of them ever in the whole wide world).

Honestly, the UI for creating a story is really, really good in Einstein so I don't think you'll need a ton of help here. But if you find yourself stuck, Salesforce provides [comprehensive documentation](https://help.salesforce.com/articleView?id=bi_edd_create.htm&type=5) on this topic.

For the purpose of this documentation, just know that you'll want to create a story that contains Insights + Predictions. If this doesn't make sense, don't worry, you'll understand as you go through the story creation process for the first time.

## Deploying a Model

OK, you've built a story, you're generating incredible insights, you're going to get promoted any day now, all is well with the world. What now? Well, now you just need to deploy your model so that we can start passing data to it from Tableau Prep Builder.

Within your Story, there is a Model button, press that then you should see a button that says Deploy Model. Easy peasy! Well, you actually have to walk through a few questions after you press that button, but that's OK, it's all pretty simple stuff. A couple of helpful tips for you as you walk through the deploy process:

* You **do not** need to map your model to a Salesforce object
* Think carefully about which fields you designate as actionable, these are the fields that Einstein will base its prescriptive analysis on (so, make sure those are fields that you can actually control in practice).

Still stuck on something model-related? Well, Salesforce documentation has a whole section called [Work with Models](https://help.salesforce.com/articleView?id=bi_edd_model.htm&type=5) that should be able to get you moving again.