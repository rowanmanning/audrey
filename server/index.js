'use strict';

const {camelcase} = require('varname');
const configureExpress = require('@rowanmanning/express-config');
const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const path = require('path');
const requireAll = require('@rowanmanning/require-all');
const schedule = require('node-schedule');

module.exports = async function audrey() {

	// Create a MongoDB connection
	const mongoConnectionUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/audrey';
	const db = await mongoose.createConnection(mongoConnectionUrl).asPromise();

	// Create and export an express app
	const app = module.exports = configureExpress(express(), {

		// Configure paths
		viewPath: path.join(__dirname, 'view'),
		publicPath: path.join(__dirname, '..', 'client', 'public'),

		// Configure logger
		pino: {
			name: 'Audrey',
			level: process.env.LOG_LEVEL || (
				process.env.NODE_ENV === 'production' ?
					'info' :
					'debug'
			)
		},

		// Configure sessions
		sessionName: 'Audrey Session',
		sessionSecret: process.env.SESSION_SECRET,
		sessionStore: MongoStore.create({client: db.getClient()}),

		// Configure security
		helmet: {
			contentSecurityPolicy: {
				directives: {
					'default-src': [`'self'`],
					'block-all-mixed-content': [],
					'font-src': [`'self'`, 'https:', 'data:'],
					'frame-ancestors': [`'self'`],
					'img-src': ['*'],
					'media-src': ['*'],
					'frame-src': [
						'https://*.youtube.com/',
						'https://*.spotify.com/'
					],
					'object-src': [`'none'`],
					'script-src-attr': [`'none'`],
					'style-src': [`'self'`, 'https://fonts.googleapis.com/'],
					'upgrade-insecure-requests': []
				}
			},
			crossOriginEmbedderPolicy: false,
			crossOriginOpenerPolicy: false,
			crossOriginResourcePolicy: {
				policy: 'cross-origin'
			}
		}
	});

	// Set trust proxy
	// TODO move this into `@rowanmanning/express-config`
	// See https://github.com/rowanmanning/app/tree/db6f624351b1739b117aacd96ec6a72bd8c8e7d7#app-options (trustProxy)
	app.set('trust proxy', true);

	// Store the database on the app
	app.db = db;

	// Load the models
	app.models = {};
	const modelModules = requireAll(path.join(__dirname, 'model'));
	for (const {name, moduleExports: setupModel} of modelModules) {
		const camelcaseName = camelcase(name);
		app.models[camelcaseName] = db.model(camelcaseName, setupModel(app));
		app.log.debug(`${camelcaseName} model initialised`);
	}

	// Set up the scheduled feed refresh job
	let scheduledJob;
	const updateSchedule = app.updateSchedule = process.env.UPDATE_SCHEDULE || '0 */2 * * *'; // Every 2 hours
	if (process.env.NODE_ENV !== 'test') {
		try {
			scheduledJob = schedule.scheduleJob(updateSchedule, async () => {
				try {
					await app.models.Entry.performScheduledJobs();
					await app.models.Feed.performScheduledJobs();
					app.log.info({
						name: 'Scheduler',
						msg: 'Scheduled jobs complete'
					});
				} catch (error) {
					app.log.error({
						name: 'Scheduler',
						msg: `Scheduled jobs failed: ${error.message}`
					});
				}
			});
			app.log.info({
				name: 'Scheduler',
				msg: `Started with cron "${updateSchedule}"`
			});
		} catch (error) {
			app.log.error({
				name: 'Scheduler',
				msg: `Setup failed: ${error.message}`
			});
		}
	}

	// Augment the application `stop` method to also close the database connection
	const stop = app.stop;
	app.stop = async () => {
		if (scheduledJob) {
			scheduledJob.cancel();
		}
		await db.close();
		await stop();
	};

	// Set up pre-route middleware
	app.use(app.preRoute);

	// Add the app to the locals
	app.locals.app = app;

	// Add request data to response locals
	app.use((request, response, next) => {
		response.locals.request = request;
		response.locals.currentUrl = request.url;
		response.locals.currentPath = request.path;
		next();
	});

	// Load settings into each request
	app.use(async (request, response, next) => {
		try {
			request.settings = response.locals.settings = await app.models.Settings.get();
			next();
		} catch (error) {
			next(error);
		}
	});

	// Add a home breadcrumb if we're not on the home page
	app.use((request, response, next) => {
		response.locals.breadcrumbs = [];
		if (request.path !== '/') {
			response.locals.breadcrumbs.push({
				label: request.settings.siteTitle,
				url: '/'
			});
		}
		next();
	});

	// Load the controllers
	const controllerModules = requireAll(path.join(__dirname, 'controller'));
	for (const {name, moduleExports: setupController} of controllerModules) {
		setupController(app);
		app.log.debug(`${name} controller initialised`);
	}

	// Set up post-route middleware
	app.use(app.postRoute);

	return app;
};
