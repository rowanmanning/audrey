'use strict';

const Field = require('.');

module.exports = class NumberField extends Field {

	constructor(renderContext) {
		super(renderContext);
		this.context.type = 'number';
	}

};
