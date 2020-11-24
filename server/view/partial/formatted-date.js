'use strict';

const format = require('date-fns/format');
const formatISO = require('date-fns/formatISO');
const formatDistance = require('date-fns/formatDistance');
const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents a formatted date.
 */
module.exports = class FormattedDate extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the formatted date.
	 * @param {Date} context.date
	 *     The date to format.
	 */
	constructor(context) {
		super(context);
		this.date = this.context.date ?? new Date();
	}

	/**
	 * Render the formatted date.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the formatted datedate.
	 */
	render() {
		const isoDate = formatISO(this.date);
		const longDate = format(this.date, 'do MMMM yyyy, HH:mm');
		const relativeDate = formatDistance(this.date, new Date(), {addSuffix: true});
		return html`
			<time datetime=${isoDate} title=${longDate}>${relativeDate}</time>
		`;
	}

};
