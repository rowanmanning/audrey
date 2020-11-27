/**
 * @rowanmanning/paginate-middleware module
 * @module @rowanmanning/paginate-middleware
 */
'use strict';

const setQueryParam = require('../lib/set-query-param');

/**
 * Create an Express middleware function which constructs pagination information.
 *
 * @access public
 * @param {Object} [options={}]
 *     The pagination options.
 * @param {Function} [options.total]
 *     A function which returns the total number of documents to paginate over.
 * @param {Number} [options.perPage=25]
 *     The number of items to display per page.
 * @param {String} [options.property='pagination']
 *     The request/response property to store pagination data on.
 * @param {String} [options.pageProperty='page']
 *     The querystring property which controls the current page.
 * @returns {ExpressMiddleware}
 *     Returns a middleware function.
 */
module.exports = function paginate(options = {}) {
	const property = options.property || 'pagination';
	const pageProperty = options.pageProperty || 'page';
	const perPage = options.perPage || 25;
	const getTotal = (typeof options.total === 'function' ? options.total : () => 0);

	return async (request, response, next) => {
		const pagination = request[property] = response.locals[property] = {};

		pagination.totalItems = await getTotal(request, response);
		pagination.totalPages = Math.ceil(pagination.totalItems / perPage);
		pagination.currentPage = 1;
		pagination.perPage = perPage;

		// Work out the current page
		if (request.query[pageProperty]) {
			const parsedCurrentPage = parseInt(request.query[pageProperty], 10);
			if (!Number.isNaN(parsedCurrentPage) && parsedCurrentPage > 0) {
				pagination.currentPage = Math.min(parsedCurrentPage, pagination.totalPages);
			}
		}
		pagination.currentPageStartIndex = (pagination.currentPage - 1) * perPage;
		pagination.currentPageEndIndex = (pagination.currentPage * perPage) - 1;

		// Get the previous page path
		pagination.previousPagePath = null;
		if (pagination.currentPage > 1) {
			pagination.previousPagePath = setQueryParam(
				request.url,
				pageProperty,
				Math.min(pagination.currentPage - 1, pagination.totalPages)
			);
		}

		// Get the next page path
		pagination.nextPagePath = null;
		if (pagination.currentPage < pagination.totalPages) {
			pagination.nextPagePath = setQueryParam(
				request.url,
				pageProperty,
				pagination.currentPage + 1
			);
		}

		next();
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
