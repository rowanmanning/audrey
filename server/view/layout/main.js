'use strict';

const Footer = require('../partial/footer');
const Header = require('../partial/header');
const {html} = require('@rowanmanning/app');
const layout = require('./default');

/**
 * Render the main website layout.
 *
 * @param {Object} context
 *     The view render context.
 * @param {Object} content
 *     The main page content as an HTML element.
 * @returns {Object}
 *     Returns an HTML element.
 */
module.exports = function renderMainLayout(context, content) {
	return layout(context, html`
		<${Header}
			title=${context.app.name}
			currentPath=${context.currentPath}
			currentUser=${context.currentUser}
		/>
		<main class="page">${content}</main>
		<${Footer}/>
	`);
};
