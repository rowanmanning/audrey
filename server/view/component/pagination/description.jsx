'use strict';

const AbsoluteDate = require('../absolute-date');
const {h, Component} = require('preact');

/**
 * Represents website pagination description.
 */
module.exports = class PaginationDescription extends Component {

	/**
	 * Render the pagination description.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the pagination description.
	 */
	render({date, resetUrl}) {
		if (!date) {
			return '';
		}
		return (
			<div class="notification notification--warning">
				<p>
					You are viewing entries published before <AbsoluteDate date={date} />.
					You can switch to viewing <a href={resetUrl}>most recent entries here</a>.
				</p>
			</div>
		);
	}

};
