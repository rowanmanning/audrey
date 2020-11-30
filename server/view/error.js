'use strict';

const {html} = require('@rowanmanning/app');
const layout = require('./layout/main');

/**
 * Render an error page view.
 *
 * @param {Object} context
 *     The view render context.
 * @param {module:@rowanmanning/app~App} context.app
 *     The application.
 * @param {Error} context.error
 *     The error which caused an error page to be rendered.
 * @returns {Object}
 *     Returns an HTML element.
 */
module.exports = function renderErrorView(context) {
	const {error} = context;

	context.pageTitle = `Error: ${error.statusCode}`;

	// Populate main content
	const content = html`
		<div class="content-body">
			<p>${error.message}</p>
			<${errorStack} stack=${error.stack}/>
		</div>
	`;

	// Populate content sub-sections
	context.subSections = {

		// Content heading
		heading: html`
			<div class="content-head">
				<h1 class="content-head__title">${context.pageTitle}</h1>
			</div>
		`
	};

	// Wrap the content in a layout and return to render
	return layout(context, content);
};

/**
 * Render an error stack.
 *
 * @param {Object} context
 *     The render context.
 * @param {String} [context.stack]
 *     The error stack to render.
 * @returns {(Object|String)}
 *     Returns an HTML element representing the stack, or an empty string if there is no stack.
 */
function errorStack({stack}) {
	if (stack) {
		return html`<pre class="error-stack">${stack}</pre>`;
	}
	return '';
}
