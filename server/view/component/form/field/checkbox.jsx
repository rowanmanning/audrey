
'use strict';

const Field = require('.');

/**
 * Represents a form checkbox field.
 */
module.exports = class CheckboxField extends Field {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.type = 'checkbox';
	}

};
