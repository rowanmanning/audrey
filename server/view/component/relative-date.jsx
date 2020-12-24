'use strict';

const format = require('date-fns/format');
const formatISO = require('date-fns/formatISO');
const formatDistance = require('date-fns/formatDistance');
const {h, Component} = require('@rowanmanning/app/preact');

/**
 * Represents a relative date element.
 */
module.exports = class RelativeDate extends Component {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.state = {
			date: this.props.date || new Date()
		};
	}

	/**
	 * Render the date element.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the date.
	 */
	render(_, {date}) {
		const isoDate = formatISO(date);
		const longDate = format(date, 'do MMMM yyyy, HH:mm');
		const relativeDate = formatDistance(date, new Date(), {addSuffix: true});
		return <time datetime={isoDate} title={longDate}>{relativeDate}</time>;
	}

};
