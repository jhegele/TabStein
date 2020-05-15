# FAQ

##### Prep Builder errors out before all the predictions are finished.

This is probably due to setting a timeout that is too short. Out of the box, the default timeout for TabPy is 30 seconds which is not nearly enough to make multiple requests back and forth to Einstein and generate predictions. TabStein, by default, bumps this up to 10 minutes but, for large datasets, that may not be sufficient either.

##### TabPy reports errors when running my integration.

This is a little tough to diagnose in an FAQ. Probably best to [open an issue](https://github.com/jhegele/TabStein/issues) and I'll try to take a look. Be as descriptive as possible about what type of data you're sending, how many rows, etc.

##### Where do I get a Consumer Key and Consumer Secret, what are these things?

The Consumer Key and Consumer Secret are provided by Salesforce when you create a connected app. These pieces of information identify the application to Salesforce and are part of authenticating via OAuth. You can find more info on this topic in the [Salesforce Setup](salesforce-setup.md) documentation.

##### When I run dependency checks in TabStein I always get failures. What gives?

Yeah, this is a little finicky to be honest and it's due to the fact that you can deploy Python in a ton of different ways. Add to that the fact that virtual environments are frequently used with Python and, well, it gets pretty complex. The short answer is, those failures don't necessarily mean the integration won't work on your system. The slightly longer answer is, if you can provide the direct path to your Python executable, that should help. If you're on macOS, you can open up your terminal, navigate to the directory where you want to setup your integration and run `which python` in order to do this.

##### I contacted Tableau Support about this application and they had no idea what I was talking about.

This application is developed and maintained individually and is not officially released by, nor supported by, Tableau. I'm happy to provide as much support as I can if you would be willing to [open an issue](https://github.com/jhegele/TabStein/issues) and give me some details on what you need.

##### Your application is broken and doesn't work for me!

Sorry to hear that. If you would [open an issue](https://github.com/jhegele/TabStein/issues) and give me some details, I'll do my best to take a look and try to figure out what's going on.

##### Can I help out with this project?

Sure! If you want to submit a PR, I'm happy to take a look at it. Otherwise, feel free to fork this and do your own thing.