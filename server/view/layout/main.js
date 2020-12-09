'use strict';

const Footer = require('../partial/section/footer');
const Header = require('../partial/section/header');
const {html} = require('@rowanmanning/app');
const layout = require('./default');
const Main = require('../partial/section/main');

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
			title=${context.settings.siteTitle}
			currentPath=${context.currentPath}
		/>
		<${Main} subSections=${context.subSections}>
			${content}
		<//>
		<${Footer}/>
	`);
};
