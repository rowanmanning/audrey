'use strict';

const {html, Partial} = require('@rowanmanning/app');
const manifest = require('../../../../package.json');

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
			<footer role="contentinfo" class="footer page-layout">
				<div class="footer__inner page-layout__main">
					<small class="footer__copyright">
						Copyright © ${this.getCurrentYear()}, ${this.renderAuthor()}
					</small>
				</div>
			</footer>
		`;
	}

	renderAuthor() {
		const author = manifest.author;
		return html`<a href=${author.url}>${author.name}</a>`;
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
