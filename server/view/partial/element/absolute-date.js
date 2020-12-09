'use strict';

const format = require('date-fns/format');
const formatISO = require('date-fns/formatISO');
const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents a date element.
 */
module.exports = class AbsoluteDate extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the date element.
	 * @param {Date} context.date
	 *     The date to format.
	 */
	constructor(context) {
		super(context);
		this.date = this.context.date || new Date();
	}

	/**
	 * Render the date element.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the date element.
	 */
	render() {
		const isoDate = formatISO(this.date);
		const longDate = format(this.date, 'do MMMM yyyy, HH:mm');
		return html`
			<time datetime=${isoDate} title=${longDate}>${longDate}</time>
		`;
	}

};
