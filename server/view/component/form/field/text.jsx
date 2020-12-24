
'use strict';

const Field = require('.');

/**
 * Represents a form text field.
 */
module.exports = class TextField extends Field {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.type = 'text';
		this.props.modifiers.push('text');
	}

};
