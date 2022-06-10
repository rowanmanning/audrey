'use strict';

/**
 * Create an Express middleware function which makes a route require a logged in user.
 *
 * @access public
 * @returns {ExpressMiddleware}
 *     Returns a middleware function.
 */
module.exports = function requireAuth() {
	return (request, response, next) => {
		if (!request.settings.hasPassword()) {
			return response.redirect('/');
		}
		if (!request.session.isAuthenticated) {
			return response.redirect(`/login?redirect=${request.url}`);
		}
		next();
	};
};

/**
 * A middleware function.
 *
 * @callback ExpressMiddleware
 * @param {Object} request
 *     An Express Request object.
 * @param {Object} response
 *     An Express Response object.
 * @param {ExpressMiddlewareCallback} next
 *     A callback function.
 * @returns {undefined}
 *     Returns nothing.
 */

/**
 * A callback function.
 *
 * @callback ExpressMiddlewareCallback
 * @param {Error} error
 *     An HTTP error.
 * @returns {undefined}
 *     Returns nothing.
 */
