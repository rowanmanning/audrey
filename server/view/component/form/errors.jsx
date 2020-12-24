'use strict';

const {h, Component} = require('@rowanmanning/app/preact');
const Notification = require('../notification');

/**
 * Represents a form error notification.
 */
module.exports = class FormErrors extends Component {

	/**
	 * Render the form errors.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the form errors.
	 */
	render({errors}) {
		if (!errors || errors.length === 0) {
			return '';
		}
		return (
			<Notification type="error">
				<p><strong>There were some issues with the form:</strong></p>
				<ul>{errors.map(error => <li data-test="form-error">{error.message}</li>)}</ul>
			</Notification>
		);
	}

};
