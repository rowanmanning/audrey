'use strict';

const Field = require('.');

module.exports = class EmailField extends Field {

	constructor(renderContext) {
		super(renderContext);
		this.context.type = 'email';
		this.context.modifiers = ['text'];
	}

};
