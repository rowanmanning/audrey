'use strict';

const {html, Partial} = require('@rowanmanning/app');

module.exports = class FormErrors extends Partial {

	render() {
		if (!this.context.errors || this.context.errors.length === 0) {
			return '';
		}
		return html`
			<div class="notification notification--error">
				<p><strong>There were some issues with the form:</strong></p>
				<ul>
					${this.context.errors.map(this.renderError)}
				</ul>
			</div>
		`;
	}

	renderError(error) {
		return html`
			<li data-test="form-error">${error.message}</li>
		`;
	}

};
