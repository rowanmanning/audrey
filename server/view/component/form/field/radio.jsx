
'use strict';

const Field = require('.');

/**
 * Represents a form radio field.
 */
module.exports = class RadioField extends Field {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.type = 'radio';
	}

};
