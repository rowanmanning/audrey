
'use strict';

const {h, Component} = require('@rowanmanning/app/preact');

/**
 * Represents a form field.
 */
module.exports = class BaseField extends Component {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		if (!this.props.label) {
			throw new Error('Field `label` is required');
		}
		this.props.modifiers = this.props.modifiers || [];
		this.props.labelElement = this.props.labelElement || 'label';
	}

	/**
	 * Render the field.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the field.
	 */
	render({modifiers, type}) {
		const classList = [
			'field',
			...modifiers.map(modifier => `field--${modifier}`),
			(type ? `field--${type}` : '')
		];
		return (
			<div class={classList.join(' ').trim()}>
				<div class="field__label">
					{this.renderLabel()}
				</div>
				<div class="field__input">
					{this.renderInput()}
				</div>
			</div>
		);
	}

	/**
	 * Render the field label.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the field label.
	 */
	renderLabel() {
		const {fieldId, label, labelElement: Label} = this.props;
		return (
			<Label for={fieldId}>
				<span class="field__label-text">{label}</span>
				{this.renderDescription()}
			</Label>
		);
	}

	/**
	 * Render the field description.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the field description.
	 */
	renderDescription() {
		const {description} = this.props;
		if (description) {
			return (
				<span class="field__description">{description}</span>
			);
		}
		return '';
	}

};
