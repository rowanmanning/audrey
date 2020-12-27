'use strict';

const render = require('@rowanmanning/response-render-middleware');
const requireAuth = require('../middleware/require-auth');
const setQueryParam = require('../lib/set-query-param');
const {ValidationError} = require('@rowanmanning/app');

module.exports = function mountHomeController(app) {
	const {router} = app;
	const {Entry, Feed, Settings} = app.models;

	router.get('/', [
		setPassword,
		requireAuth(),
		fetchStats,
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
			const entryPagination = await Entry.fetchPaginated(request.query.before, 50, {
				isRead: false
			});
			response.locals.entryPagination = entryPagination;
			response.locals.entries = entryPagination.items;
			response.locals.nextPage = (
				entryPagination.next ?
					setQueryParam(request.url, 'before', entryPagination.next) :
					null
			);
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
