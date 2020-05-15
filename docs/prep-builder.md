# Tableau Prep Builder

Prep Builder is the integration point for this process on the Tableau side.

## Preparing Your Prep Flow for Einstein Integration

1. Build your flow as you normally would:
   1. Connect to your data sources
   2. Clean/transform your data
2. Get your data into a state where you're ready to send it to Einstein for predictions
   1. It's important that, at this stage, your data contains the columns needed by your Einstein model(s)
3. Create one extra Clean Step
4. Add placeholder fields for your prediction outputs
   1. The easiest way to do this is to add a calculated field, give it a descriptive name, and set the value to 0.0
   2. Make sure you use 0.0 so that Prep detects this field as a floating point number and _not_ as an integer (otherwise all your results from Einstein will be converted to integers which you probably don't want)

**At this point, you should run TabStein to setup your integration!**

5. Add a Script step
   1. Under Settings choose Tableau Python (TabPy) Server
   2. Click the Connect to Tableau Python (TabPy) Server button
   3. Enter the address and port for your TabPy Server and any necessary auth info and sign in
   4. Click the Browse button under File Name
   5. Choose the `prep.py` file that TabStein created for you
   6. Under function name, type `einstein` and press enter

That's it! You're done and now Prep is sending data to Einstein to generate predictions.