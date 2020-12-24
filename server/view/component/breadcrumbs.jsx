'use strict';

const {h, Component} = require('@rowanmanning/app/preact');

/**
 * Represents website breadcrumbs.
 */
module.exports = class Breadcrumbs extends Component {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.items = this.props.items || [];
	}

	/**
	 * Render the breadcrumbs.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the website breadcrumbs.
	 */
	render({items}) {
		if (!items.length) {
			return '';
		}
		return (
			<nav class="breadcrumb">
				<ol itemscope itemtype="https://schema.org/BreadcrumbList">
					{items.map((item, index) => this.renderItem(item, index + 1))}
				</ol>
			</nav>
		);
	}

	/**
	 * Render a single breadcrumb.
	 *
	 * @access private
	 * @param {Object} breadcrumb
	 *     An object representation of a breadcrumb.
	 * @param {Number} position
	 *     The position of the breadcrumb item.
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the breadcrumb.
	 */
	renderItem({label, url}, position) {
		return (
			<li class="breadcrumb__item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
				<a itemprop="item" href={url} data-test="breadcrumb">
					<span itemprop="name">{label}</span>
				</a>
				<meta itemprop="position" content={position} />
			</li>
		);
	}

};
