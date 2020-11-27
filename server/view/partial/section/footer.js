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
						<a href=${manifest.homepage}>Audrey</a> is licensed under ${' '}
						<a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPLv3</a>.<br/>
						Copyright © ${this.getCurrentYear()}, ${this.renderAuthor()}.<br/>
						Powered by Audrey v${manifest.version} ${' | '}
						<a href="${manifest.homepage}#readme">Documentation</a> ${' | '}
						<a href=${manifest.bugs}>Report an issue</a>
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
