'use strict';

const {html, Partial} = require('@rowanmanning/app');

module.exports = class FormSubmit extends Partial {

	render() {
		return html`
			<input
				type="submit"
				value=${this.context.label || 'Submit'}
				class="form__submit ${this.context.danger ? 'form__submit--danger' : ''}"
			/>
		`;
	}

};
