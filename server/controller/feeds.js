'use strict';

const redirect = require('../middleware/redirect');
const render = require('../middleware/render');

module.exports = function mountFeedsController(app) {
	const {router} = app;
	const {Feed} = app.models;

	router.get('/feeds', [
		fetchAllFeeds,
		render('page/feeds/list')
	]);

	router.post('/feeds', [
		createFeed,
		redirect('/feeds')
	]);

	async function fetchAllFeeds(request, response, next) {
		try {
			response.locals.feeds = await Feed.fetchAll();
			next();
		} catch (error) {
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
