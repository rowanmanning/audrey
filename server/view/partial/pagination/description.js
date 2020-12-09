'use strict';

const AbsoluteDate = require('../element/absolute-date');
const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents website pagination description.
 */
module.exports = class PaginationDescription extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the description.
	 * @param {String} context.date
	 *     The date that the pagination is currently filtering by.
	 * @param {String} context.resetUrl
	 *     The URL used to reset pagination.
	 */
	constructor(context) {
		super(context);
		this.date = this.context.date;
		this.resetUrl = this.context.resetUrl;
	}

	/**
	 * Render the pagination description.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the pagination description.
	 */
	render() {
		if (!this.date) {
			return '';
		}
		return html`
			<div class="notification notification--warning">
				<p>
					You are viewing entries published before ${' '}
					<${AbsoluteDate} date=${this.date} />.
					You can switch to viewing <a href=${this.resetUrl}>most recent entries here</a>.
				</p>
			</div>
		`;
	}

};
