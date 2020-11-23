'use strict';

const render = require('../middleware/render');
const {ValidationError} = require('@rowanmanning/app');

module.exports = function mountFeedsByIdController(app) {
	const {router} = app;
	const {Entry, Feed} = app.models;

	router.get('/feeds/:feedId', [
		fetchFeedById,
		handleRefreshFeedForm,
		fetchFeedEntries,
		render('page/feeds/view')
	]);

	router.post('/feeds/:feedId/refresh', [
		fetchFeedById,
		handleRefreshFeedForm,
		fetchFeedEntries,
		render('page/feeds/view')
	]);

	async function fetchFeedById(request, response, next) {
		try {
			request.feed = response.locals.feed = await Feed.findById(request.params.feedId);
			if (response.locals.feed) {
				return next();
			}
			next('route');
		} catch (error) {
			next(error);
		}
	}

	async function fetchFeedEntries(request, response, next) {
		try {
			response.locals.entries = await Entry.fetchAllByFeedId(response.locals.feed._id);
			next();
		} catch (error) {
			next(error);
		}
	}

	// Middleware to handle feed refreshing
	async function handleRefreshFeedForm(request, response, next) {

		// Add settings form details to the render context
		const refreshFeedForm = response.locals.refreshFeedForm = {
			action: request.feed.refreshUrl,
			errors: [],
			data: {}
		};

		try {
			// On POST, attempt to refresh the feed
			if (request.method === 'POST') {
				await request.feed.sync();
				return response.redirect(request.feed.url);
			}
			next();
		} catch (error) {
			console.log('ERROR?', error);
			if (error instanceof ValidationError) {
				refreshFeedForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

};
