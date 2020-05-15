# How It Works

Below is a high level overview of how this integration works.

## Goals

First, let's start with the goals of this project as they are fairly simple and will act as a guide for any future development.

* Provide a seamless means of integrating Einstein Discovery's predictive and, in the future, prescriptive capabilities into Tableau Prep Builder.
* Allow users to integrate these tools with **no coding required**.
* Leverage officially supported APIs and integration frameworks for development (no hacks!)

## Salesforce

The primary integration point for Salesforce is via a Connected App ([more here](salesforce-setup.md)). This Connected App allows us to use Salesforce's API in order to pass data through to Einstein models.

## Einstein

Within Einstein, you simply need a deployed model in order to generate predictions against. See the [Einstein](einstein.md) section for additional details.

## Tableau Prep Builder

We leverage Tableau Prep Builder's support for TabPy in order to integrate with Salesforce and Einstein. TabPy is a standalone, Python-based server that can receive data from a Tableau Prep flow, transform it (in our case by adding predictions), and return the dataset to the flow for further processing.

## How Is TabStein Built?

TabStein is written, primarily, in [TypeScript](https://www.typescriptlang.org/) and makes use of many open source tools and libraries including:

* [Electron](https://www.electronjs.org/)
* [React](https://reactjs.org/)
* [NodeJS](https://nodejs.org/en/)
* [Python](https://www.python.org/)

The full list of JavaScript dependencies can be found in the [package.json](https://github.com/jhegele/TabStein/blob/master/package.json) file within the GitHub repository.