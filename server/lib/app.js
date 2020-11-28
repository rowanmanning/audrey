'use strict';

const App = require('@rowanmanning/app');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const uuid = require('uuid');

// TODO move this into the connection config in @rowanmanning/app
mongoose.set('useFindAndModify', false);

module.exports = class AudreyApp extends App {

	constructor(options = {}) {
		options.name = 'Audrey';
		options.databaseUrl = options.databaseUrl || 'mongodb://localhost:27017/audrey';
		options.sessionSecret = options.sessionSecret || uuid.v4();
		options.updateSchedule = options.updateSchedule || '0 */2 * * *'; // Every 2 hours
		super(options);
		this.addListener('database:connected', () => this.setupScheduledJobs());
	}

	setupControllers() {

		// Load settings into each request
		this.router.use(async (request, response, next) => {
			try {
				const {Settings} = this.models;
				request.settings = response.locals.settings = await Settings.get();
				next();
			} catch (error) {
				next(error);
			}
		});

		// Add a home breadcrumb if we're not on the home page
		this.router.use((request, response, next) => {
			response.locals.breadcrumbs = [];
			if (request.path !== '/') {
				response.locals.breadcrumbs.push({
					label: request.settings.siteTitle,
					url: '/'
				});
			}
			next();
		});

		// Add the full request to the view
		this.router.use((request, response, next) => {
			response.locals.request = request;
			next();
		});

		super.setupControllers();
	}

	setupScheduledJobs() {
		try {
			this.scheduledJob = schedule.scheduleJob(this.options.updateSchedule, async () => {
				try {
					await this.models.Entry.performScheduledJobs();
					await this.models.Feed.performScheduledJobs();
					this.log.info(`[sheduler]: scheduled jobs complete`);
				} catch (error) {
					this.log.error(`[sheduler]: scheduled jobs failed: ${error.message}`);
				}
			});
			this.log.info(`[setup:sheduler]: started with cron "${this.options.updateSchedule}"`);
		} catch (error) {
			this.log.error(`[setup:sheduler]: setup failed, ${error.message}`);
		}
	}

};
