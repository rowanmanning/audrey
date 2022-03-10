'use strict';

const format = require('date-fns/format');
const formatISO = require('date-fns/formatISO');
const {h, Component} = require('preact');

/**
 * Represents an absolute date element.
 */
module.exports = class AbsoluteDate extends Component {

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
		return <time datetime={isoDate} title={longDate}>{longDate}</time>;
	}

};
