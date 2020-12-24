
'use strict';

const Field = require('.');

/**
 * Represents a form number field.
 */
module.exports = class NumberField extends Field {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.type = 'number';
		this.props.modifiers.push('text');
	}

};
