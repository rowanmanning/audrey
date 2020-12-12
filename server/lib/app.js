'use strict';

const App = require('@rowanmanning/app');
const schedule = require('node-schedule');
const uuid = require('uuid');

module.exports = class AudreyApp extends App {

	constructor(options = {}) {
		options.name = 'Audrey';
		options.databaseUrl = options.databaseUrl || 'mongodb://localhost:27017/audrey';
		options.securityConfig = {
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
			}
		};
		options.sessionSecret = options.sessionSecret || uuid.v4();
		options.updateSchedule = options.updateSchedule || '0 */2 * * *'; // Every 2 hours
		super(options);

		// When we're not in the test environment, run scheduled jobs
		if (this.env !== 'test') {
			this.addListener('database:connected', () => this.setupScheduledJobs());
		}
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

	teardown() {
		if (this.scheduledJob) {
			this.scheduledJob.cancel();
			this.log.info(`[teardown:sheduler]: scheduled jobs cancelled`);
		}
		super.teardown();
	}

};
