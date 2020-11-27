'use strict';

const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents website pagination.
 */
module.exports = class Breadcrumb extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the pagination.
	 * @param {Object} context.data
	 *     The pagination data.
	 */
	constructor(context) {
		super(context);
		this.pagination = this.context.data;
	}

	/**
	 * Render the pagination.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the pagination.
	 */
	render() {
		if (this.pagination.totalPages <= 1) {
			return '';
		}
		return html`
			<nav class="pagination">
				${this.renderPreviousLink()}${' '}
				${this.renderPageNumbers()}${' '}
				${this.renderNextLink()}
			</nav>
		`;
	}

	/**
	 * Render the previous page link.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the pagination item.
	 */
	renderPreviousLink() {
		if (!this.pagination.previousPagePath) {
			return '';
		}
		return html`
			<span class="pagination__previous">
				<a href=${this.pagination.previousPagePath} rel="prev">
					Previous page
				</a>
			</span>
		`;
	}

	/**
	 * Render the next page link.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the pagination item.
	 */
	renderNextLink() {
		if (!this.pagination.nextPagePath) {
			return '';
		}
		return html`
			<span class="pagination__next">
				<a href=${this.pagination.nextPagePath} rel="next">
					Next page
				</a>
			</span>
		`;
	}

	/**
	 * Render the page numbers.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the pagination item.
	 */
	renderPageNumbers() {
		return html`
			<span class="pagination__numbers">
				Page ${this.pagination.currentPage} of ${this.pagination.totalPages}
			</span>
		`;
	}

};
