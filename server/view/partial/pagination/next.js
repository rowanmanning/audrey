'use strict';

const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents website pagination next page button.
 */
module.exports = class PaginationNext extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the next page button.
	 * @param {String} context.url
	 *     The next page URL.
	 */
	constructor(context) {
		super(context);
		this.url = this.context.url;
	}

	/**
	 * Render the pagination next page button.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the pagination next page button.
	 */
	render() {
		if (!this.url) {
			return '';
		}
		return html`
			<nav class="nav-list nav-list--centered">
				<a class="nav-list__link nav-list__link--inline" href=${this.url} rel="next" data-test="pagination-next">
					${this.context.children.length ? this.context.children : 'Next page'}
				</a>
			</nav>
		`;
	}

};
