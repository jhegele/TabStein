# Overview

Below is a high level overview of how to setup an integration between Tableau Prep Builder and Einstein Discovery. There are multiple ways to do this but this is the process that I've found to be the most reliable and easiest.

1. In Prep Builder, connect to your data sources and build your flow to clean/transform your data
2. Once your data is ready to use in Einstein, use Clean Steps in Prep Builder to gather a set of training data for Einstein
   * As an added benefit, generating your training data from Prep Builder makes it easy to retrain your model in the future if you need to!
3. Output your training data as a CSV from Prep Builder and load it into Einstein as a new data set
4. In Einstein, create a Story using this new data set
5. Once you are happy with your Story, deploy your model
6. Go back to Tableau Prep and add placeholder columns for your prediction outputs
7. Lauch TabStein and configure your integration
8. Go back to Tableau Prep and add the script step in order to utilize the `prep.py` file created by TabStein
9. Publish your output, with predictions, to Tableau Server as a data source
10. Bask in the respect and adoration of your peers and colleagues

