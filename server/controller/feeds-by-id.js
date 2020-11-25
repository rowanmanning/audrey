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

	router.get('/feeds/:feedId/settings', [
		fetchFeedById,
		handleFeedSettingsForm,
		render('page/feeds/settings')
	]);

	router.post('/feeds/:feedId/settings', [
		fetchFeedById,
		handleFeedSettingsForm,
		render('page/feeds/settings')
	]);

	router.get('/feeds/:feedId/unsubscribe', [
		fetchFeedById,
		handleUnsubscribeForm,
		render('page/feeds/unsubscribe')
	]);

	router.post('/feeds/:feedId/unsubscribe', [
		fetchFeedById,
		handleUnsubscribeForm,
		render('page/feeds/unsubscribe')
	]);

	async function fetchFeedById(request, response, next) {
		try {
			request.feed = response.locals.feed = await Feed
				.findById(request.params.feedId)
				.populate('errors')
				.populate('entries');
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
				await request.feed.refresh();
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

	// Middleware to handle feed settings
	async function handleFeedSettingsForm(request, response, next) {

		// Add feed settings form details to the render context
		const feedSettingsForm = response.locals.feedSettingsForm = {
			action: request.feed.settingsUrl,
			errors: [],
			data: {
				customTitle: (
					request.body.customTitle === undefined ?
						request.feed.customTitle :
						request.body.customTitle
				)
			}
		};

		try {
			// On POST, attempt to save the feed
			if (request.method === 'POST') {

				// We use a fresh feed object so that we don't interfere
				// with displayed properties outside of the form
				const feed = await Feed.findById(request.feed._id);
				feed.customTitle = feedSettingsForm.data.customTitle;
				await feed.save();
				return response.redirect(feed.url);
			}
			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				feedSettingsForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

	// Middleware to handle feed unsubscribe
	async function handleUnsubscribeForm(request, response, next) {

		// Add unsubscribe form details to the render context
		const unsubscribeForm = response.locals.unsubscribeForm = {
			action: request.feed.unsubscribeUrl,
			errors: [],
			data: {
				confirm: Boolean(request.body.confirm)
			}
		};

		try {
			// On POST, attempt to unsubscribe from the feed
			if (request.method === 'POST') {
				if (unsubscribeForm.data.confirm) {
					await request.feed.unsubscribe();
					response.redirect('/feeds');
				} else {
					const error = new ValidationError();
					error.errors.confirm = new Error('Please confirm that you want to unsubscribe from this feed');
					throw error;
				}
			}
			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				unsubscribeForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

};
