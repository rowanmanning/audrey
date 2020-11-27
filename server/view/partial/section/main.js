'use strict';

const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents a website main content area.
 */
module.exports = class Main extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the main section.
	 * @param {Object} [context.subSections={}]
	 *     Data for the sub-sections in the main section.
	 * @param {Object} [context.subSections.heading]
	 *     HTML content to go in the heading section.
	 * @param {Object} [context.subSections.lhs]
	 *     HTML content to go in the left-hand side bar.
	 * @param {Object} [context.subSections.rhs]
	 *     HTML content to go in the right-hand side bar.
	 * @param {Boolean} [context.subSections.hideHeading=false]
	 *     Whether to hide the heading section.
	 */
	constructor(context) {
		super(context);
		const subSections = this.context.subSections || {};
		this.heading = subSections.heading;
		this.lhs = subSections.lhs;
		this.rhs = subSections.rhs;
		this.content = this.context.children;
		this.hideHeading = Boolean(subSections.hideHeading);
	}

	/**
	 * Render the main section.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the website main section.
	 */
	render() {
		return html`
			<main role="main" class="main">
				${this.renderHeading()}
				<div class="page-layout">
					${this.renderLeftHandSidebar()}
					<div class="main__content page-layout__main">
						${this.content}
					</div>
					${this.renderRightHandSidebar()}
				</div>
			</main>
		`;
	}

	/**
	 * Render the heading.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the heading.
	 */
	renderHeading() {
		if (this.heading) {
			return html`
				<header class="main__heading page-layout ${this.hideHeading ? 'hidden' : ''}">
					<div class="page-layout__main">
						${this.heading}
					</div>
				</header>
			`;
		}
		return '';
	}

	/**
	 * Render the left-hand sidebar.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the left-hand sidebar.
	 */
	renderLeftHandSidebar() {
		if (this.lhs) {
			return html`
				<aside class="main__lhs page-layout__lhs">
					${this.lhs}
				</aside>
			`;
		}
		return '';
	}

	/**
	 * Render the right-hand sidebar.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the right-hand sidebar.
	 */
	renderRightHandSidebar() {
		if (this.rhs) {
			return html`
				<aside class="main__rhs page-layout__rhs">
					${this.rhs}
				</aside>
			`;
		}
		return '';
	}

};
