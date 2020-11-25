'use strict';

const redirect = require('../middleware/redirect');

module.exports = function mountFeedsRefreshController(app) {
	const {router} = app;
	const {Feed} = app.models;

	router.post('/feeds/refresh', [
		handleRefreshForm,
		redirect('/feeds')
	]);

	// Middleware to handle feed refreshing
	function handleRefreshForm(request, response, next) {
		Feed.refreshAll();
		next();
	}

};
