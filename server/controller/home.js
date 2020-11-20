'use strict';

const render = require('../middleware/render');

module.exports = function mountHomeController(app) {
	const {router} = app;

	router.get('/', render('page/home'));

};
