'use strict';

const Field = require('.');

module.exports = class CheckboxField extends Field {

	constructor(renderContext) {
		super(renderContext);
		this.context.type = 'checkbox';
	}

};
