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

		super.setupControllers();
	}

	async setupScheduledJobs() {
		try {
			const settings = await this.models.Settings.get();

			// If the app is in demo mode, wipe the entries every 15 minutes
			// and refresh all of the feeds so that entries are freshly loaded
			if (settings.demoMode) {
				this.setupScheduledDemoJobs();

			// Otherwise refresh feeds on a schedule
			} else {
				this.setupScheduledStandardJobs();
			}

		} catch (error) {
			this.log.error(`[setup:sheduler]: setup failed, ${error.message}`);
		}
	}

	setupScheduledStandardJobs() {
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
	}

	setupScheduledDemoJobs() {
		this.scheduledJob = schedule.scheduleJob('0,15,30,45 * * * *', async () => {
			try {
				await this.models.Entry.deleteMany({});
				await this.models.Feed.refreshAll();
				this.log.info(`[sheduler]: scheduled jobs complete`);
			} catch (error) {
				this.log.error(`[sheduler]: scheduled jobs failed: ${error.message}`);
			}
		});
		this.log.info(`[setup:sheduler]: started in demo mode, resetting entries every 15 minutes`);
	}

	teardown() {
		if (this.scheduledJob) {
			this.scheduledJob.cancel();
			this.log.info(`[teardown:sheduler]: scheduled jobs cancelled`);
		}
		super.teardown();
	}

};
