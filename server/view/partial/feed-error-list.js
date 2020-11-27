'use strict';

const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents a list of feed errors.
 */
module.exports = class FeedErrorList extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the error list.
	 * @param {Array} [context.errors]
	 *     An array of feed errors to render.
	 */
	constructor(context) {
		super(context);
		this.errors = this.context.errors ?? [];
	}

	/**
	 * Render the list of feed errors.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the list of feed errors.
	 */
	render() {
		if (this.errors.length) {
			return html`
				<div class="notification notification--error">
					<p><strong>There were issues when this feed was last refreshed:</strong></p>
					<ul>
						${this.errors.map(this.renderError)}
					</ul>
				</div>
			`;
		}
		return '';
	}

	/**
	 * Render a single feed error.
	 *
	 * @access private
	 * @param {Object} error
	 *     An object representation of a feed error.
	 * @returns {Object}
	 *     Returns an HTML element representing the feed error.
	 */
	renderError(error) {
		return html`
			<li>${error.message}</li>
		`;
	}

};
