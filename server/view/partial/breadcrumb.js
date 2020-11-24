'use strict';

const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents website breadcrumbs.
 */
module.exports = class Breadcrumb extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the breadcrumb.
	 * @param {Array<Object>} [context.items=[]]
	 *     The breadcrumb items.
	 */
	constructor(context) {
		super(context);
		this.context.items = this.context.items || [];
	}

	/**
	 * Render the breadcrumbs.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the website breadcrumbs.
	 */
	render() {
		if (!this.context.items.length) {
			return '';
		}
		const breadcrumbItems = this.context.items.map((item, index) => {
			return this.renderBreadcrumbItem(item, index + 1);
		});
		return html`
			<nav class="breadcrumb">
				<ol itemscope itemtype="https://schema.org/BreadcrumbList">
					${breadcrumbItems}
				</ol>
			</nav>
		`;
	}

	/**
	 * Render a single breadcrumb item.
	 *
	 * @access private
	 * @param {Object} item
	 *     An object representation of a breadcrumb item.
	 * @param {Number} position
	 *     The position of the breadcrumb item.
	 * @returns {Object}
	 *     Returns an HTML element representing the breadcrumb item.
	 */
	renderBreadcrumbItem(item, position) {
		return html`
			<li class="breadcrumb__item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
				<a itemprop="item" href=${item.url}>
					<span itemprop="name">${item.label}</span>
				</a>
				<meta itemprop="position" content="${position}" />
			</li>
		`;
	}

};
