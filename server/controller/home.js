'use strict';

const paginate = require('../middleware/paginate');
const render = require('../middleware/render');
const requireAuth = require('../middleware/require-auth');
const {ValidationError} = require('@rowanmanning/app');

module.exports = function mountHomeController(app) {
	const {router} = app;
	const {Entry, Feed, Settings} = app.models;

	router.get('/', [
		setPassword,
		requireAuth(),
		fetchStats,
		paginate({
			perPage: 50,
			property: 'entryPagination',
			total: () => Entry.countUnread()
		}),
		fetchUnreadEntries,
		render('page/home')
	]);

	router.post('/', [
		setPassword
	]);

	async function fetchStats(request, response, next) {
		try {
			const [totalEntryCount, totalFeedCount] = await Promise.all([
				Entry.countAll(),
				Feed.countAll()
			]);
			response.locals.totalEntryCount = totalEntryCount;
			response.locals.totalFeedCount = totalFeedCount;
			next();
		} catch (error) {
			next(error);
		}
	}

	async function fetchUnreadEntries(request, response, next) {
		try {
			response.locals.entries = await Entry
				.fetchUnread()
				.skip(request.entryPagination.currentPageStartIndex)
				.limit(request.entryPagination.perPage)
				.populate('feed');
			next();
		} catch (error) {
			next(error);
		}
	}

	// Function to hijack the regular home page flow and
	// inject a password setting form (for first load)
	async function setPassword(request, response, next) {

		// If the app has a password, carry on with
		// rendering the regular home page
		if (request.settings.hasPassword()) {
			return next();
		}

		// Add password form details to the render context
		const setPasswordForm = response.locals.setPasswordForm = {
			action: request.url,
			errors: [],
			data: {
				password: request.body.password || ''
			}
		};

		try {
			// On POST, attempt to hash the password
			if (request.method === 'POST') {
				await Settings.setPassword(setPasswordForm.data.password);
				request.flash('password-set', true);
				return response.redirect('/');
			}
			response.render('page/auth/password');
		} catch (error) {
			if (error instanceof ValidationError) {
				setPasswordForm.errors = Object.values(error.errors);
				response.status(400);
				return response.render('page/auth/password');
			}
			next(error);
		}

	}

};
