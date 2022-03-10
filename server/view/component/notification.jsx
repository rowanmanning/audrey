'use strict';

const {h, Component} = require('preact');

/**
 * Represents a notification.
 */
module.exports = class Notification extends Component {

	/**
	 * Render the notification element.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the notification.
	 */
	render({type, children, testId}) {
		const classList = [
			'notification',
			(type ? `notification--${type}` : '')
		];
		return (
			<div class={classList.join(' ').trim()} data-test={testId}>
				{children}
			</div>
		);
	}

};
