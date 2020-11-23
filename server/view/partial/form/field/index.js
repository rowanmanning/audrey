'use strict';

const BaseField = require('./base');
const {html} = require('@rowanmanning/app');
const shortid = require('shortid');

module.exports = class Field extends BaseField {

	constructor(renderContext) {
		super(renderContext);
		if (!this.context.name) {
			throw new Error('Field `name` is required');
		}
		this.context.fieldId = this.context.fieldId || shortid.generate();
	}

	renderInput() {
		return html`
			<input
				id=${this.context.fieldId}
				type=${this.context.type}
				name=${this.context.name}
				value=${this.context.value}
				disabled=${this.context.disabled}
				checked=${this.context.checked}
				min=${this.context.min}
				max=${this.context.max}
				step=${this.context.step}
			/>
		`;
	}

};
