'use strict';

const format = require('date-fns/format');
const formatISO = require('date-fns/formatISO');
const formatDistance = require('date-fns/formatDistance');
const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents a relative date element.
 */
module.exports = class RelativeDateElement extends Partial {

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
		const relativeDate = formatDistance(this.date, new Date(), {addSuffix: true});
		return html`
			<time datetime=${isoDate} title=${longDate}>${relativeDate}</time>
		`;
	}

};
