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

	// Set the title here, so it's passed into the layout
	context.title = `Error: ${context.error.statusCode}`;

	// Wrap the view in the default layout
	return layout(context, html`
		<h1>${context.title}</h1>
		<p>${context.error.message}</p>
		<${errorStack} stack=${context.error.stack}/>
	`);

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
