
# Audrey: Deploying on DigitalOcean

Running Audrey on [DigitalOcean](https://www.digitalocean.com/) is relatively easy when you use their App Platform. There is no free option, so be willing to pay ~$5 per month to keep Audrey running. We provide manual instructions as well as a _nearly_ one-click button to get you set up.


## Table of Contents

  * [Setting up MongoDB](#setting-up-mongodb)
  * [One-click setup](#one-click-setup)
  * [Manual setup](#manual-setup)
  * [Configuration notes](#configuration-notes)


## Setting up MongoDB

Before you can run the application, you'll need somewhere to host your MongoDB database. You'll need to choose a provider below. If you're willing to shell out money, Digital Ocean's offering integrates best but it's a lot more pricey than a free MongoDB Atlas!

| Provider                                                             | Has a free tier | Documentation                                                     |
|----------------------------------------------------------------------|-----------------|-------------------------------------------------------------------|
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended)   | Yes             | [Docs](https://developer.mongodb.com/how-to/use-atlas-on-heroku)  |
| [DigitalOcean Managed Database](https://www.mongodb.com/cloud/atlas) | No              | [Docs](https://docs.digitalocean.com/products/databases/mongodb/) |

Once you've decided on a provider, you'll need to follow their documentation to get a database set up. You will be creating your DigitalOcean app in either the EU or US region, make sure that the region of your database and the region of your DigitalOcean app align, or Audrey will not be very performant.

To continue on deploying Audrey to DigitalOcean, you'll need to get a [MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/) which your provider should present to you. It will look something like this:

```
mongodb://username:password@example.com:1234/database
```

Once you have this, continue with either the [manual](#manual-setup) or [one-click](#one-click-setup) setup.


## Manual setup

To deploy Audrey to DigitalOcean manually you'll need a DigitalOcean account. Then follow the instructions below:

  1. Visit <https://cloud.digitalocean.com/apps> and click the button to create a new app

  2. Fill out and submit the form with your application details choosing "rowanmanning/audrey" as a repo

  3. Accept the default settings for a Node.js application (the build and start scripts will be detected correctly)

  4. Choose an application name and select a region close to your choice of MongoDB database

  5. Select a pricing plan. A basic plan with 512MB RAM works just fine for Audrey, select this for the cheapest cost of ~$5 per month

  6. Click the "Launch" button, and Audrey should start to deploy!

  7. Now we need to add some configurations. Click on the "Settings" tab and then under "App-Level
Environment Variables", click "Edit"

  8. Configure your app using the [configurations outlined below](#configuration-notes)

  9. After a successful deploy, you should be able to access your new application in-browser, click the app URL near the top of your dashboard in DigitalOcean. An Audrey page should load

  10. You'll need to set up a password via the interface. You need to remember this password to regain access if your session expires. Now you're ready to start using Audrey!


## One-click setup

The button below sets up a full DigitalOcean application, adding some default configurations. You'll need a DigitalOcean account to get started, and Audrey will run fine on the cheapest tier which has a few limitations.

For most DigitalOcean users, all you need to do is click the button and fill out a few fields. Click the button below and then check the [configuration notes for DigitalOcean](#configuration-notes) if you have questions on what to fill in.

You'll also probably want to select the cheapest plan to start with – a basic plan with 512MB RAM works just fine for Audrey.

[![Deploy to DigitalOcean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/rowanmanning/audrey/tree/main)

Once your app is up-and-running, you'll need to set up a password via the interface. You need to remember this password to regain access if your session expires. Now you're ready to start using Audrey!


## Configuration notes

When configuring a DigitalOcean app to run Audrey, it's important that you:

  - Create your database and DigitalOcean application in the same region (probably the one closest to you)

Some of the configurations should be adjusted slightly when running Audrey on DigitalOcean:

  - **`MONGODB_URI`**: This should be a MongoDB connection string provided by a MongoDB cloud provider. See [Setting up MongoDB](#setting-up-mongodb).

  - **`NODE_ENV`**: This should be set to `production` in the application (as this is not set by default in DigitalOcean) but set to `development` in the build step so that assets can be compiled.

  - **`PORT`**: There's no need to set this as, DigitalOcean sets this environment variable automatically to `8080`.

  - **`SESSION_SECRET`**: This is automatically generated for the one-click deploy. In the manual deploy, failing to set this will cause sessions to be dropped whenever your DigitalOcean app restarts. Use something like a [UUID generator](https://www.uuidgenerator.net/) for this secret – you don't need to remember it.

  - **`UPDATE_SCHEDULE`**: Set this to however often you want to refresh feeds. We normally configure to every 15 minutes: `*/15 * * * *`.
