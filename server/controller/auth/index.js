'use strict';

const redirect = require('../../middleware/redirect');

module.exports = function mountAuthController(app) {
	const {router} = app;

	router.get('/auth', [
		redirect('/auth/login')
	]);

};
