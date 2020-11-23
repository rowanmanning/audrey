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

	router.get('/feeds/:feedId/edit', [
		fetchFeedById,
		handleEditFeedForm,
		render('page/feeds/edit')
	]);

	router.post('/feeds/:feedId/edit', [
		fetchFeedById,
		handleEditFeedForm,
		render('page/feeds/edit')
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

		// Add refresh feed form details to the render context
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
			if (error instanceof ValidationError) {
				refreshFeedForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

	// Middleware to handle feed editing
	async function handleEditFeedForm(request, response, next) {

		// Add edit feed form details to the render context
		const editFeedForm = response.locals.editFeedForm = {
			action: request.feed.editUrl,
			errors: [],
			data: {
				customTitle: (
					request.body.customTitle === undefined ?
						request.feed.customTitle :
						request.body.customTitle
				),
				xmlUrl: request.body.xmlUrl || request.feed.xmlUrl
			}
		};

		try {
			// On POST, attempt to save the feed
			if (request.method === 'POST') {

				// We use a fresh feed object so that we don't interfere
				// with displayed properties outside of the form
				const feed = await Feed.findById(request.feed._id);
				feed.customTitle = editFeedForm.data.customTitle;
				feed.xmlUrl = editFeedForm.data.xmlUrl;
				await feed.save();
				return response.redirect(feed.url);
			}
			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				editFeedForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

};
