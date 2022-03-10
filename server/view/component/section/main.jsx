'use strict';

const {h, Component} = require('preact');

/**
 * Represents a website main content area.
 */
module.exports = class MainSection extends Component {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		const subSections = this.props.subSections || {};
		this.heading = subSections.heading;
		this.lhs = subSections.lhs;
		this.rhs = subSections.rhs;
		this.content = this.props.children;
		this.hideHeading = Boolean(subSections.hideHeading);
	}

	/**
	 * Render the main section.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the website main section.
	 */
	render() {
		return (
			<main role="main" class="main" data-test="main">
				{this.renderHeading()}
				<div class="page-layout">
					{this.renderLeftHandSidebar()}
					<div class="main__content page-layout__main">
						{this.content}
					</div>
					{this.renderRightHandSidebar()}
				</div>
			</main>
		);
	}

	/**
	 * Render the heading.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the heading.
	 */
	renderHeading() {
		if (this.heading) {
			return (
				<header class={`main__heading page-layout ${this.hideHeading ? 'hidden' : ''}`}>
					<div class="page-layout__main">
						{this.heading}
					</div>
				</header>
			);
		}
		return '';
	}

	/**
	 * Render the left-hand sidebar.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the left-hand sidebar.
	 */
	renderLeftHandSidebar() {
		if (this.lhs) {
			return (
				<aside class="main__lhs page-layout__lhs">
					{this.lhs}
				</aside>
			);
		}
		return '';
	}

	/**
	 * Render the right-hand sidebar.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the right-hand sidebar.
	 */
	renderRightHandSidebar() {
		if (this.rhs) {
			return (
				<aside class="main__rhs page-layout__rhs">
					{this.rhs}
				</aside>
			);
		}
		return '';
	}

};
