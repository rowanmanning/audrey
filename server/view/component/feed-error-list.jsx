'use strict';

const {h, Component} = require('@rowanmanning/app/preact');
const Notification = require('./notification');

/**
 * Represents a list of feed errors.
 */
module.exports = class FeedErrorList extends Component {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.errors = this.props.errors || [];
	}

	/**
	 * Render the feed error list.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the feed error list.
	 */
	render({errors}) {
		if (errors.length) {
			return (
				<Notification type="error">
					<p><strong>There were issues when this feed was last refreshed:</strong></p>
					<ul>
						{errors.map(error => <li>{error.message}</li>)}
					</ul>
				</Notification>
			);
		}
		return '';
	}

};
