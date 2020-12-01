
# Audrey: Deploying on Heroku

Running Audrey on [Heroku](https://www.heroku.com/) is relatively easy comparted to hosting on a server of your own. We provide manual instructions as well as a _nearly_ one-click button to get you set up.


## Table of Contents

  * [Setting up MongoDB](#setting-up-mongodb)
  * [One-click setup](#one-click-setup)
  * [Manual setup](#manual-setup)
  * [Configuration notes](#configuration-notes)


## Setting up MongoDB

Before you can run the application, you'll need somewhere to host your MongoDB database. Until recently, it was possible to add a free MongoDB database to a Heroku app with mLab, but now there are a few more steps. Firstly you'll need to choose a provider:

| Provider                                                           | Has a free tier | Has a Heroku Add-on | Documentation                                                    |
|--------------------------------------------------------------------|-----------------|---------------------|------------------------------------------------------------------|
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended) | Yes             | No                  | [Docs](https://developer.mongodb.com/how-to/use-atlas-on-heroku) |
| [ObjectRocket](https://www.objectrocket.com/)                      | No              | Yes                 | [Docs](https://elements.heroku.com/addons/ormongo)               |


Once you've decided on a provider, you'll need to follow their documentation to get a database set up. You will be creating your Heroku app in either the EU or US region, make sure that the region of your database and the region of your Heroku app align, or Audrey will not be very performant.

To continue on deploying Audrey to Heroku, you'll need to get a [MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/) which your provider should present to you. It will look something like this:

```
mongodb://username:password@example.com:1234/database
```

Once you have this, continue with either the [manual](#manual-setup) or [one-click](#one-click-setup) setup.


## Manual setup

To deploy Audrey to Heroku manually you'll need a Heroku account. Then follow the instructions below:

  1. Visit <https://dashboard.heroku.com/> and click the button to create a new app

  2. Fill out and submit the form with your application name, remembering to use the same region as your database is hosted in

  5. Now we need to add some configurations. Click on the "Settings" tab and then under "Config Variables", click "Reveal Config Vars"

  6. Configure your app using the [configurations outlined below](#configuration-notes)

  7. Now we're ready to deploy for the first time. Click on the "Deploy" tab and choose a deployment method. We recommend either Heroku Git, or connecting to your own forked copy of Audrey on GitHub. Either way, the instructions in the Heroku interface should be helpful here

  8. After a successful deploy, you should be able to access your new application in-browser, click the "Open app" button that appears at the top of your dashboard in Heroku. An Audrey page should load

  9. You'll need to set up a password via the interface. You need to remember this password to regain access if your session expires. Now you're ready to start using Audrey!


## One-click setup

The button below sets up a full Heroku application, adding some default configurations. You'll need a Heroku account to get started, and Audrey will run fine on the free tier which has a few limitations.

For most Heroku users, all you need to do is click the button and fill out a few fields. Click the button below and then check the [configuration notes for Heroku](#configuration-notes) if you have questions on what to fill in.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/rowanmanning/audrey/tree/main)

Once your app is up-and-running, you'll need to set up a password via the interface. You need to remember this password to regain access if your session expires. Now you're ready to start using Audrey!


## Configuration notes

When configuring a Heroku app to run Audrey, it's important that you:

  - Create your database and Heroku application in the same region (probably the one closest to you)

Some of the configurations should be adjusted slightly when running Audrey on Heroku:

  - **`MONGODB_URI`**: This should be a MongoDB connection string provided by a MongoDB cloud provider. See [Setting up MongoDB](#setting-up-mongodb).

  - **`NODE_ENV`**: This should not be specified, it will default to `production`.

  - **`PORT`**: This should not be specified, Heroku sets this environment variable automatically and overriding it will cause your app to crash.

  - **`SESSION_SECRET`**: This is automatically generated for the one-click deploy. In the manual deploy, failing to set this will cause sessions to be dropped every 24 hours when your Heroku app restarts. Use something like a [UUID generator](https://www.uuidgenerator.net/) for this secret – you don't need to remember it.

  - **`UPDATE_SCHEDULE`**: If you're using Heroku's free tier, you should set this to a refresh feeds more frequently. This is because the app won't be running unless you've recently accessed it via the web. We normally configure to every 15 minutes: `0,15,30,45 * * * *`.
