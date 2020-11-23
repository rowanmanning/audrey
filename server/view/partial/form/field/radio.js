'use strict';

const Field = require('.');

module.exports = class RadioField extends Field {

	constructor(renderContext) {
		super(renderContext);
		this.context.type = 'radio';
	}

};
