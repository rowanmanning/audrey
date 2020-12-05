'use strict';

const {html} = require('@rowanmanning/app');
const manifest = require('../../../package.json');

/**
 * Render a default layout.
 *
 * @param {Object} context
 *     The view render context.
 * @param {String} context.title
 *     The content to add to the `<title>` element.
 * @param {Object} content
 *     The main page content as an HTML element.
 * @returns {Object}
 *     Returns an HTML element.
 */
module.exports = function renderDefaultLayout(context, content) {
	const {pageDescription, pageTitle, settings} = context;

	// Set the title to include the site title
	const title = pageTitle ? `${pageTitle} | ${settings.siteTitle}` : settings.siteTitle;

	// Set up client-side asset cache-busting
	const assetCacheBustValue = manifest.version;

	// Return the rendered HTML
	return html`
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<title>${title}</title>
				${renderPageDescription(pageDescription)}
				<meta name="robots" content="noindex" />
				<meta name="viewport" content="width=device-width" />
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap" />
				<link rel="stylesheet" href="/main.css?${assetCacheBustValue}" />
			</head>
			<body class="page">
				${content}
			</body>
		</html>
	`;
};

function renderPageDescription(description) {
	if (description) {
		return html`<meta name="description" content=${description} />`;
	}
	return '';
}
