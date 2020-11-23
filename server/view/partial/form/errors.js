'use strict';

const {html, Partial} = require('@rowanmanning/app');

module.exports = class FormErrors extends Partial {

	render() {
		if (!this.context.errors || this.context.errors.length === 0) {
			return '';
		}
		return html`
			<div class="form__errors" data-test="form-errors">
				There was a problem processing the form:
				<ul>
					${this.context.errors.map(this.renderError)}
				</ul>
			</div>
		`;
	}

	renderError(error) {
		return html`
			<li class="form__error" data-test="form-error">${error.message}</li>
		`;
	}

};
