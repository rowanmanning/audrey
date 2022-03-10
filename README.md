
# Audrey

Audrey is a simple single-user feed reader, focused on a no-frills reading experience. Audrey allows you to subscribe to [RSS](https://en.wikipedia.org/wiki/RSS) and [Atom](https://en.wikipedia.org/wiki/Atom_(Web_standard)) feeds and read content in one place.

Audrey is self-hosted; you can set up an installation on your own server or cloud provider. There's no creepy harvesting of your data, and no algorithms to recommend new content.

[![Latest build status](https://github.com/rowanmanning/audrey/workflows/CI/badge.svg?event=push)](https://github.com/rowanmanning/audrey/actions?query=workflow%3ACI)

**[Note: Audrey is currently in beta](#beta-notice)**

<table>
  <tbody>
    <tr>
      <td>
        <img src="https://user-images.githubusercontent.com/138944/100798817-0d315e80-341c-11eb-8d68-e8a6862425ad.png" alt="A screenshot of the Audrey home page, showing a single column list of feed entries to be read" />
      </td>
      <td>
        <img src="https://user-images.githubusercontent.com/138944/100799120-7d3fe480-341c-11eb-9093-e8cc0bcf27ad.png" alt="A screenshot of a blog post displayed within the Audrey interface" />
      </td>
    </tr>
  </tbody>
</table>


## Table of Contents

  * [Requirements](#requirements)
  * [Running Locally](#running-locally)
  * [Running on a Server](#running-on-a-server)
  * [Cloud Provider Guides](#cloud-provider-guides)
    * [Glitch `↪`](docs/guide/glitch.md)
    * [Heroku `↪`](docs/guide/heroku.md)
  * [Config Options](#config-options)
  * [Beta Notice](#beta-notice)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This application requires the following to run:

  * [Node.js](https://nodejs.org/) v14.0.0+
  * [MongoDB](https://www.mongodb.com/) v4.0.0+


## Running Locally

You can run Audrey locally if you intend on making your own changes, or just want to test it out. Follow theses steps to get Audrey running on your local machine:

  1. Make sure you have all of the software listed in [Requirements](#requirements)

  2. Clone this repository, and `cd` into it:

        ```sh
        git clone https://github.com/rowanmanning/audrey.git && cd audrey
        ```

  3. Install the application dependencies:

        ```sh
        npm install
        ```

  4. Copy the sample `.env` file to make changes to the [configuration](#config-options). You'll need to do this if you want sessions to persist between restarts of the application. The following command copies `sample.env` to `.env`:

        ```sh
        cp sample.env .env
        ```

  5. Build client-side assets (Sass):

        ```sh
        npm run build
        ```

        Or run the following if you want assets to automatically rebuild:

        ```sh
        npm run watch
        ```

  6. Start the application in production mode:

        ```sh
        npm start
        ```

        Or development mode if you want code changes to auto-restart the application:

        ```sh
        npm run start:dev
        ```

  7. Visit [localhost:8080](http://localhost:8080/) in your browser (the port may be different if you made changes to the default `.env` file)

  8. Set up a password on the locally running site. You'll need to remember this password to regain access if your session expires


## Running on a Server

The instructions for running on a server are the same as [running locally](#running-locally) apart from the following differences:

  * It may not be possible to create an `.env` file, dependent on your setup. You'll need a different way to provide configurations via environment variables

  * You'll need to run the `npm run build` command at some point before the deployment of the application finishes

  * The URL to access the application will be whatever your public server address is, rather than `localhost`


## Cloud Provider Guides

Audrey has guides for the following common cloud providers:

  * [Deploy Audrey on Glitch](docs/guide/glitch.md) (free and paid options)
  * [Deploy Audrey on Heroku](docs/guide/heroku.md) (free and paid options)


## Config Options

This application is configured using environment variables, or an [`.env` file](https://github.com/motdotla/dotenv) if you're running locally. The following options are available:

  - **`MONGODB_URI`**: A MongoDB connection string, used to connect to the database.<br/>
    Default: `mongodb://localhost:27017/audrey`

  - **`NODE_ENV`**: The environment to run the application in, one of `production`, `development`, `test`.<br/>
    Default: `development`.

  - **`PORT`**: The HTTP port to run the application on. If set to an empty string, a random port will be assigned.<br/>
    Default: `8080`.

  - **`SESSION_SECRET`**: A secret key for session hashing. If this is not set, a random key will be used on each restart of the application. This will cause sessions to drop off, and is very annoying in development.

  - **`UPDATE_SCHEDULE`**: A [cron expression](https://en.wikipedia.org/wiki/Cron#Overview) which specifies when Audrey should refresh all of the feeds you're subscribed to. If you're unsure how to write cron expressions, [this site helps](https://crontab.guru/).<br/>
    Default: `0 */2 * * *` (every 2 hours).

You can also change more configurations through the settings page of a running copy of Audrey, these additional configurations are stored in the database.


## Beta Notice

Audrey is currently in beta, and may not have all of the features you expect from a feed reader yet. I'm deliberately keeping a reduced set of features, but please check the [feature label](https://github.com/rowanmanning/audrey/issues?q=is%3Aissue+label%3Afeature) in the [issues](https://github.com/rowanmanning/audrey/issues) before requesting anything

I really appreciate feedback on the stability of Audrey, if you're willing to give it a go as your primary feed reader then I'll be happy to address any bugs you come across during your day-to-day use.


## Contributing

[The contributing guide is available here](docs/contributing.md). All contributors must follow [this library's code of conduct](docs/code_of_conduct.md).


## License

Licensed under the [GPLv3](LICENSE) license.<br/>
Copyright &copy; 2020, Rowan Manning.
