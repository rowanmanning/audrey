'use strict';

const BaseField = require('./base');
const Field = require('.');
const {html} = require('@rowanmanning/app');

module.exports = class GroupField extends BaseField {

	constructor(renderContext) {
		super(renderContext);
		this.context.modifiers = ['group'];
		this.context.labelElement = 'div';
		if (this.context.children.length === 0) {
			throw new Error('Group input must have child elements');
		}
		if (!this.context.children.every(child => child.type.prototype instanceof Field)) {
			throw new Error('Group input children must only be Field instances');
		}
		if (this.context.children.some(child => child.props.description)) {
			throw new Error('Grouped fields cannot have descriptions');
		}
	}

	renderInput() {
		return this.context.children.map(field => this.renderChildField(field));
	}

	renderChildField(field) {
		const ChildField = field.type;
		field = new ChildField(field.props);
		const classNames = ['field', 'field--child'];
		if (field.context.type) {
			classNames.push(`field--${field.context.type}`);
		}
		return html`
			<div class=${classNames.join(' ')}>
				<div class="field__label">
					${field.renderLabel()}
				</div>
				<div class="field__input">
					${field.renderInput()}
				</div>
			</div>
		`;
	}

};
