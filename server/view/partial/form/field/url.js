'use strict';

const Field = require('.');

module.exports = class UrlField extends Field {

	constructor(renderContext) {
		super(renderContext);
		this.context.type = 'url';
		this.context.modifiers = ['text'];
	}

};
