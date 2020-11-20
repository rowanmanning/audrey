'use strict';

const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents a website footer.
 */
module.exports = class Footer extends Partial {

	/**
	 * Render the footer.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the website footer.
	 */
	render() {
		return html`
			<footer class="site-footer">
				<small class="site-footer__copyright">
					Copyright © ${this.getCurrentYear()}.
				</small>
			</footer>
		`;
	}

	/**
	 * Get the current year.
	 *
	 * @access private
	 * @returns {String}
	 *     Returns a string representation of the current year.
	 */
	getCurrentYear() {
		return new Date().getFullYear();
	}

};
