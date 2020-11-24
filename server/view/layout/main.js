'use strict';

const Breadcrumb = require('../partial/breadcrumb');
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
			title=${context.settings.siteTitle}
			currentPath=${context.currentPath}
		/>
		<main role="main" class="main">
			<div class="main__inner">
				<${Breadcrumb} items=${context.breadcrumbs} />
				${content}
			</div>
		</main>
		<${Footer}/>
	`);
};
