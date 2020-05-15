# Salesforce Setup

In order to make use of TabStein, you'll need to do a little setup in Salesforce first. You'll likely need adminstrative rights on your Salesforce instance in order to complete this setup. If you don't have admin rights then make friends with your Salesforce admin. All this aside, it'll be worth your while to buddy up to the Salesforce admin.

## Connected App Setup

In order to connect to Salesforce from another application you'll need, well, a Connected App. Salesforce provides [pretty extensive documentation](https://help.salesforce.com/articleView?id=connected_app_create.htm&type=5) on this topic so I won't rehash that here. The important thing to know, and **this is very important so please make a note of it**, is that after you finish creating your Connected App, you'll receive a Consumer Key and Consumer Secret. **You must have the Consumer Key and Consumer Secret in order to use this application! Do not disregard or lose these!**

## OAuth Settings

TabStein uses OAuth 2.0 to authenticate to Salesforce. Without getting too into the weeds on this topic, OAuth requires that you specify a set of scopes that control access. Below are the minimal scopes that I believe are necessary for the application to function properly (though I'm not an expert on Salesforce's permissioning model so please log an issue if this is inaccurate).

* Access and manage your Wave data (wave_api)

I think that's it but, again, I could be wrong here. The easy path (which I took) is to provide `Full access (full)` but, uh, that's probably not recommended.