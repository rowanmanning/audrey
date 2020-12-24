
'use strict';

const Field = require('.');

/**
 * Represents a form password field.
 */
module.exports = class PasswordField extends Field {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.type = 'password';
		this.props.modifiers.push('text');
	}

};
