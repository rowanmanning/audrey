'use strict';

const render = require('@rowanmanning/response-render-middleware');
const requireAuth = require('../middleware/require-auth');
const {ValidationError} = require('@rowanmanning/app');

module.exports = function mountSubscribeController(app) {
	const {router} = app;
	const {Feed} = app.models;

	router.get('/subscribe', [
		requireAuth(),
		handleSubscribeForm,
		render('page/subscribe')
	]);

	router.post('/subscribe', [
		requireAuth(),
		handleSubscribeForm,
		render('page/subscribe')
	]);

	// Middleware to handle feed creation
	async function handleSubscribeForm(request, response, next) {

		// Add subscribe form details to the render context
		const subscribeForm = response.locals.subscribeForm = {
			action: request.url,
			errors: [],
			data: {
				xmlUrl: request.body.xmlUrl
			}
		};

		try {
			// On POST, attempt to create a feed
			if (request.method === 'POST') {
				const feed = await Feed.subscribe(subscribeForm.data.xmlUrl);
				await feed.refresh();
				request.flash('subscribed', true);
				return response.redirect(feed.url);
			}
			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				subscribeForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

};
