'use strict';

const render = require('../middleware/render');
const {ValidationError} = require('@rowanmanning/app');

module.exports = function mountFeedsController(app) {
	const {router} = app;
	const {Feed} = app.models;

	router.get('/feeds', [
		listFeeds,
		handleCreateFeedForm,
		render('page/feeds/list')
	]);

	router.post('/feeds', [
		handleCreateFeedForm,
		render('page/feeds/list')
	]);

	async function listFeeds(request, response, next) {
		try {
			request.feeds = response.locals.feeds = await Feed.fetchAll();
			next();
		} catch (error) {
			next(error);
		}
	}

	// Middleware to handle feed creation
	async function handleCreateFeedForm(request, response, next) {

		// Add settings form details to the render context
		const createFeedForm = response.locals.createFeedForm = {
			action: request.url,
			errors: [],
			data: {
				xmlUrl: request.body.xmlUrl
			}
		};

		try {
			// On POST, attempt to create a feed
			if (request.method === 'POST') {
				await Feed.create(createFeedForm.data);
				return response.redirect('/feeds');
			}
			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				createFeedForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

	async function createFeed(request, response, next) {
		try {
			await Feed.create({
				xmlUrl: request.body.url
			});
			next();
		} catch (error) {
			next(error);
		}
	}

};
