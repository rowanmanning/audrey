'use strict';

const {html} = require('@rowanmanning/app');
const layout = require('../layout/main');

module.exports = function renderHomePage(context) {
	const {app} = context;

	context.pageTitle = app.name;

	return layout(context, html`
		<h1>${app.name}</h1>
		<p>Hello World!</p>
	`);
};
