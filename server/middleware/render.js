/**
 * @rowanmanning/render-middleware module
 * @module @rowanmanning/render-middleware
 */
'use strict';

/**
 * Create an Express middleware function which renders a view.
 *
 * @access public
 * @param {String} viewName
 *     The name of the view to render.
 * @param {Object} [renderContext={}]
 *     The render context to pass on to the view.
 * @returns {ExpressMiddleware}
 *     Returns a middleware function.
 */
module.exports = function render(viewName, renderContext = {}) {
	return (request, response) => {
		response.render(viewName, renderContext);
	};
};

/**
 * A middleware function.
 * @callback ExpressMiddleware
 * @param {Object} request
 *     An Express Request object.
 * @param {Object} response
 *     An Express Response object.
 * @returns {undefined}
 *     Returns nothing.
 */
