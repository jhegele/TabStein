# Tabpy Tools (Beta)

A set of utilities to assist with using TabPy and to enable seamless connection between Einstein Discovery and Tableau Prep.

**Please note, all support requests or issues should be logged in the issues for this repo. This product is not released by nor is it supported by Tableau. Please don't contact our awesome support team to ask about this utility!**

## Installation

Check the [`/releases` folder](releases/) to get the latest build for your operating system.

_Note: builds for all operating systems may not be available._

## Requirements

* Python 3+
* [TabPy](https://github.com/tableau/TabPy)
* Tableau Prep Builder (2019.3 or later)

### Einstein-Specific Requirements

If you intend to integrate with Einstein Discovery, there are some additional requirements:

* A Salesforce Connected App with permissions to interact with Einstein Discovery (currently referred to as Wave in the Connected App setup)
* A consumer key and consumer secret that correspond to the Connected App referenced above

## Usage

Eventually, there will be two supported scenarios for using this utility: TabPy Only and TabPy + Einstein. For the time being, and in order to arrive at a usable version, _only_ the TabPy + Einstein process has been completed. Both versions are documented below despite this.

### TabPy Only

TabPy only configuration provides a visual interface to write a `tabpy.conf` file. You will still need to write any necessary Python code in order to make use of TabPy server.

Using this utility for TabPy Only should be fairly straightforward. Simply launch the utility, select the folder where you'd like to write your `tabpy.conf` file, and set the necessary options. When you get to the step asking about Einstein integration, choose No and your file will be written for you.

### TabPy + Einstein

The TabPy + Einstein flow is meant to provide a means to integrate Einstein with minimal effort. That said, for a variety of reasons, there is still some degree of effort / complexity involved in this process. I've outlined a suggested high-level flow below to minimize the likelihood of running into issues:

1. In Tableau Prep, build your flow up to the point where you would like to integrate your Einstein step.
2. Export a set (or sets) of data as a CSV to use as training data for Einstein.
3. Import these data sets into Einstein, build your story, and deploy your model.
4. Open Tabpy Tools and work through the steps to integrate your newly created model with your Tableau Prep flow.
5. Go back to Tableau Prep and the flow you created in Step 1 and add a new Script step.
6. For this new Script step, apply the following settings:
   1. Connection type: Tableau Python (TabPy) Server
   2. Server: click Connect to Tableau Python (TabPy) Server and configure using the port you set during Step 4 (default is 9004)
   3. File Name: click the Browse button, go to the folder you selected during Step 4, and select the prep.py file
   4. Function Name: enter "einstein" (no quotes)
7. Finish building your Tableau Prep flow and save the file.

## FAQ

**How do I setup a Connected App in Salesforce?**
* The details of doing this are beyond the scope of this documentation, but Salesforce offers very comprehensive documentation on this type of thing that should be fairly easy to find with a quick Google search.

**Do I have to be a Salesforce admin to make this work?**
* It's certainly easier if you _are_ an admin but it's not a requirement, per se. But you will need to work with someone who has admin rights in order to setup the necessary Connected App.

**How do I load data/build a story/[insert other Einstein/Salesforce related topic here]?**
* These topics can get pretty complex and are beyond the scope of this guide. As mentioned above, Salesforce offers a ton of documentation on their platform and tools so that's always a good place to start.

**I don't want to integrate with Einstein but when I click "No" nothing happens!**
* Yep, that functionality is not yet complete. Sorry about that. For now, the primary goal is to test out integrating with Einstein.

**Your application is broken!**
* Well, that's unfortunate. Please report it in the issues tab and I'll try to take a look.

**I asked Tableau Support about this utility and they had no idea what I was talking about!**
* Yes, that makes sense as this is something I developed and, while I do work for Tableau, this is not an official Tableau-supported tool. Please log any support issues on the issues tab here and I'll try to take a look.