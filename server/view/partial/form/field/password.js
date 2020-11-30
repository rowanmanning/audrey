'use strict';

const Field = require('.');

module.exports = class PasswordField extends Field {

	constructor(renderContext) {
		super(renderContext);
		this.context.type = 'password';
		this.context.modifiers = ['text'];
	}

};
