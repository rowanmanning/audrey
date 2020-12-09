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
		${context.settings.demoMode ? html`
			<div class="notification notification--demo page-layout">
				<p class="page-layout__main">
					<strong>This app is running in demo mode</strong>, any changes will be reset
					every 15 minutes. Some features have been disabled for the demo to prevent
					inappropriate content from being displayed.
				</p>
			</div>
		` : ''}
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
