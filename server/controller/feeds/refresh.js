'use strict';

const redirect = require('@rowanmanning/response-redirect-middleware');
const requireAuth = require('../../middleware/require-auth');

module.exports = function mountFeedsRefreshController(app) {
	const {Feed} = app.models;

	app.post('/feeds/refresh', [
		requireAuth(),
		handleRefreshForm,
		redirect('/feeds')
	]);

	// Middleware to handle feed refreshing
	function handleRefreshForm(request, response, next) {
		Feed.refreshAll();
		next();
	}

};
