'use strict';

const {h, Component} = require('preact');
const manifest = require('../../../../package.json');

/**
 * Represents a website footer.
 */
module.exports = class FooterSection extends Component {

	/**
	 * Render the footer.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the website footer.
	 */
	render() {
		const {bugs, homepage, version} = manifest;
		const year = new Date().getFullYear();
		return (
			<footer role="contentinfo" class="footer page-layout">
				<div class="footer__inner page-layout__main">
					<small class="footer__copyright">
						<a href={homepage}>Audrey</a> {` is licensed under `}
						<a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPLv3</a>.<br/>
						Copyright © {year}, <a href="https://rowanmanning.com/">Rowan Manning</a>.<br/>
						Powered by Audrey v{version} {' | '}
						<a href={`${homepage}#readme`}>Documentation</a> {' | '}
						<a href={bugs}>Report an issue</a>
					</small>
				</div>
			</footer>
		);
	}

};
