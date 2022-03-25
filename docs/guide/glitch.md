
# Audrey: Deploying on Glitch

Running Audrey on [Glitch](https://glitch.com/) is relatively easy comparted to hosting on a server of your own. We provide a _nearly_ one-click button to get you set up.


## Table of Contents

  * [Setting up MongoDB](#setting-up-mongodb)
  * [One-click setup](#one-click-setup)
  * [Configuration notes](#configuration-notes)


## Setting up MongoDB

Before you can run the application, you'll need somewhere to host your MongoDB database. We recommend [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), which has a free tier. You'll need to follow [their documentation](https://docs.atlas.mongodb.com/getting-started/) to get a database set up. Make sure that your database is set up in a US region as that's where Glitch apps run, otherwise Audrey will not be very performant.

To continue on deploying Audrey to Glitch, you'll need to get a [MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/) which your provider should present to you. It will look something like this:

```
mongodb://username:password@example.com:1234/database
```

Once you have this, continue with either the [one-click](#one-click-setup) setup.


## One-click setup

The button below sets up a full Glitch application, adding some default configurations. You can set this up anonymously, but the Audrey installation will disappear after 5 days if you don't create a Glitch account. Audrey will run fine on the free tier which has a few limitations.

Click the button below and wait for the application to set up.

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/rowanmanning/audrey?MONGODB_URI=&SESSION_SECRET=&UPDATE_SCHEDULE=0,15,30,45%20*%20*%20*%20*&NODE_ENV=production)

Before the application will run properly on Glitch, you'll need to configure it via the `.env` file which is created in the root of the project. The [configuration notes for Glitch](#configuration-notes) explain what each of this values needs to be set to.

You'll also need to manually run the build script in the Terminal on Glitch by entering the following:

```
npm run build
```

Once your app is up-and-running, you'll need to set up a password via the interface. You need to remember this password to regain access if your session expires. Now you're ready to start using Audrey!


## Configuration notes

When configuring a Glitch app to run Audrey, it's important that you:

  - Create your database in a US region, otherwise database operations in the app (e.g. adding new feeds, viewing entries) are likely to be slow.

Some of the configurations should be adjusted slightly when running Audrey on Glitch. All configurations must be specified in the `.env` file in the root of your application:

  - **`MONGODB_URI`**: This should be a MongoDB connection string provided by a MongoDB cloud provider. See [Setting up MongoDB](#setting-up-mongodb).

  - **`NODE_ENV`**: must be set to `production` in order to properly cache static assets, and not expose error details to the public internet.

  - **`PORT`**: There's no need to specify this configuration, as Glitch sets this environment variable.

  - **`SESSION_SECRET`**: Failing to set this will cause sessions to be dropped every time your Glitch app restarts (which is frequently on the free tier). Use something like a [UUID generator](https://www.uuidgenerator.net/) for this secret – you don't need to remember it.

  - **`UPDATE_SCHEDULE`**: If you're using Glitch's free tier, you should set this to a refresh feeds more frequently. This is because the app won't be running unless you've recently accessed it via the web. We normally configure to every 15 minutes: `*/15 * * * *`.
