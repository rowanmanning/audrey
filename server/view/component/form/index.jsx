'use strict';

const {h, Component} = require('@rowanmanning/app/preact');

/**
 * Represents a form.
 */
module.exports = class Form extends Component {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		if (!this.props.action) {
			throw new Error('Form `action` is required');
		}
		this.props.method = this.props.method || 'post';
		this.props.enctype = this.props.enctype || 'application/x-www-form-urlencoded';
	}

	/**
	 * Render the form.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the form.
	 */
	render({action, children, enctype, method}) {
		return (
			<form method={method} action={action} enctype={enctype} class="form">
				{children}
			</form>
		);
	}

};

// Alias other form components
module.exports.Errors = require('./errors');
module.exports.Submit = require('./submit');
module.exports.Field = require('./field');
module.exports.Field.Group = require('./field/group');
module.exports.Field.Checkbox = require('./field/checkbox');
module.exports.Field.Number = require('./field/number');
module.exports.Field.Password = require('./field/password');
module.exports.Field.Radio = require('./field/radio');
module.exports.Field.Text = require('./field/text');
module.exports.Field.Url = require('./field/url');
