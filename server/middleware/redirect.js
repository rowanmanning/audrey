/**
 * @rowanmanning/redirect-middleware module
 * @module @rowanmanning/redirect-middleware
 */
'use strict';

/**
 * Create an Express middleware function which redirects a user.
 *
 * @access public
 * @param {String} url
 *     The URL to redirect to.
 * @returns {ExpressMiddleware}
 *     Returns a middleware function.
 */
module.exports = function redirect(url) {
	return (request, response) => {
		response.redirect(url);
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
