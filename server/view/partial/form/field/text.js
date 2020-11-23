'use strict';

const Field = require('.');

module.exports = class TextField extends Field {

	constructor(renderContext) {
		super(renderContext);
		this.context.type = 'text';
	}

};
