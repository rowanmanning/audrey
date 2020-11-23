'use strict';

const {html, Partial} = require('@rowanmanning/app');

module.exports = class Form extends Partial {

	constructor(renderContext) {
		super(renderContext);
		if (!this.context.action) {
			throw new Error('Form `action` is required');
		}
		this.context.method = this.context.method || 'post';
		this.context.enctype = this.context.enctype || 'application/x-www-form-urlencoded';
	}

	render() {
		return html`
			<form
				method=${this.context.method}
				action=${this.context.action}
				enctype=${this.context.enctype}
				class="form"
			>
				${this.context.children}
			</form>
		`;
	}

};

// Alias other partials
module.exports.Errors = require('./errors');
module.exports.Submit = require('./submit');
module.exports.Field = require('./field');
module.exports.Field.Group = require('./field/group');
module.exports.Field.Email = require('./field/email');
module.exports.Field.Number = require('./field/number');
module.exports.Field.Password = require('./field/password');
module.exports.Field.Radio = require('./field/radio');
module.exports.Field.Text = require('./field/text');
module.exports.Field.Url = require('./field/url');
