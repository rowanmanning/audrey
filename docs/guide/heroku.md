
# Audrey: Deploying on Heroku

Running Audrey on [Heroku](https://www.heroku.com/) is relatively easy comparted to hosting on a server of your own. We provide manual instructions as well as a _nearly_ one-click button to get you set up.


## Table of Contents

  * [Setting up MongoDB](#setting-up-mongodb)
  * [One-click setup](#one-click-setup)
  * [Manual setup](#manual-setup)
  * [Configuration notes](#configuration-notes)


## Setting up MongoDB

Before you can run the application, you'll need somewhere to host your MongoDB database. Until recently, it was possible to add a free MongoDB database to a Heroku app with mLab, but now there are a few more steps.

Firstly you'll need to choose a provider:

| Provider                                                           | Has a free tier | Has a Heroku Add-on | Documentation                                                    |
|--------------------------------------------------------------------|-----------------|---------------------|------------------------------------------------------------------|
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended) | Yes             | No                  | [Docs](https://developer.mongodb.com/how-to/use-atlas-on-heroku) |
| [ObjectRocket](https://www.objectrocket.com/)                      | No              | Yes                 | [Docs](https://elements.heroku.com/addons/ormongo)               |


Once you've decided on a provider, you'll need to follow their documentation to get a database set up. To continue on deploying Audrey to Heroku, you'll need to get a [MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/) which your provider should present to you. It will look something like this:

```
mongodb://username:password@example.com:1234/database
```

Once you have this, continue with either the [manual](#manual-setup) or [one-click](#one-click-setup) setup.


## Manual setup

TODO


## One-click setup

The button below sets up a full Heroku application, adding some default configurations. You'll need a Heroku account to get started, and Audrey will run fine on the free tier which has a few limitations.

For most Heroku users, all you need to do is click the button and fill out a few fields. Click the button below and then check the [configuration notes for Heroku](#configuration-notes) if you have questions on what to fill in.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/rowanmanning/audrey/tree/main)


## Configuration notes

Some of the configurations should be adjusted slightly when running Audrey on Heroku:

  - **`MONGODB_URI`**: This should be a MongoDB connection string provided by a MongoDB cloud provider. See [Setting up MongoDB](#setting-up-mongodb).

  - **`NODE_ENV`**: This should not be specified, it will default to `production`.

  - **`PORT`**: This should not be specified, Heroku sets this environment variable automatically and overriding it will cause your app to crash.

  - **`SESSION_SECRET`**: This is automatically generated for the one-click deploy. In the manual deploy, failing to set this will cause sessions to be dropped every 24 hours when your Heroku app restarts. Use something like a [UUID generator](https://www.uuidgenerator.net/) for this secret – you don't need to remember it.

  - **`UPDATE_SCHEDULE`**: If you're using Heroku's free tier, you should set this to a refresh feeds more frequently. This is because the app won't be running unless you've recently accessed it via the web. We normally configure to every 15 minutes: `0,15,30,45 * * * *`.
