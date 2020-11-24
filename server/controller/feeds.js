'use strict';

const render = require('../middleware/render');

module.exports = function mountFeedsController(app) {
	const {router} = app;
	const {Feed} = app.models;

	router.get('/feeds', [
		listFeeds,
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

};
