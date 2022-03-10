
'use strict';

const BaseField = require('./base');
const Field = require('./');
const {h} = require('preact');

/**
 * Represents a form grouped field.
 */
module.exports = class GroupField extends BaseField {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.modifiers = ['group'];
		this.props.labelElement = 'div';
		if (!Array.isArray(this.props.children)) {
			this.props.children = [this.props.children];
		}
		if (this.props.children.length === 0) {
			throw new Error('Group input must have child elements');
		}
		if (!this.props.children.every(child => child.type.prototype instanceof Field)) {
			throw new Error('Group input children must only be Field instances');
		}
		if (this.props.children.some(child => child.props.description)) {
			throw new Error('Grouped fields cannot have descriptions');
		}
	}

	renderInput() {
		return this.props.children.map(field => this.renderChildField(field));
	}

	renderChildField(field) {
		const ChildField = field.type;
		field = new ChildField(field.props);
		const classNames = [
			'field',
			'field--child',
			(field.props.type ? `field--${field.props.type}` : '')
		];
		return (
			<div class={classNames.join(' ').trim()}>
				<div class="field__label">
					{field.renderLabel()}
				</div>
				<div class="field__input">
					{field.renderInput()}
				</div>
			</div>
		);
	}

};
