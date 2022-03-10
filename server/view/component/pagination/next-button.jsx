'use strict';

const {h, Component} = require('preact');

/**
 * Represents website pagination next page button.
 */
module.exports = class PaginationNextButton extends Component {

	/**
	 * Render the pagination next page button.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the pagination next page button.
	 */
	render({children, url}) {
		if (!url) {
			return '';
		}
		return (
			<nav class="nav-list nav-list--centered">
				<a class="nav-list__link nav-list__link--inline" href={url} rel="next" data-test="pagination-next">
					{children.length ? children : 'Next page'}
				</a>
			</nav>
		);
	}

};
