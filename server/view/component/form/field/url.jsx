
'use strict';

const Field = require('./');

/**
 * Represents a form URL field.
 */
module.exports = class UrlField extends Field {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.type = 'url';
		this.props.modifiers.push('text');
	}

};
