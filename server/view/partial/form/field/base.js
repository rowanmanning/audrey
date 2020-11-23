'use strict';

const {html, Partial} = require('@rowanmanning/app');

module.exports = class BaseField extends Partial {

	constructor(renderContext) {
		super(renderContext);
		if (!this.context.label) {
			throw new Error('Field `label` is required');
		}
		this.context.modifiers = this.context.modifiers || [];
		this.context.labelElement = this.context.labelElement || 'label';
	}

	render() {
		const classNames = [
			'field',
			...this.context.modifiers.map(modifier => `field--${modifier}`)
		];
		if (this.context.type) {
			classNames.push(`field--${this.context.type}`);
		}
		return html`
			<div className=${classNames.join(' ')}>
				<div class="field__label">
					${this.renderLabel()}
				</div>
				<div class="field__input">
					${this.renderInput()}
				</div>
			</div>
		`;
	}

	renderLabel() {
		return html`
			<${this.context.labelElement} for=${this.context.fieldId}>
				<span class="field__label-text">${this.context.label}</span>
				${this.renderDescription()}
			<//>
		`;
	}

	renderDescription() {
		if (this.context.description) {
			return html`
				<span class="field__description">${this.context.description}</span>
			`;
		}
		return '';
	}

};
