'use strict';

const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents a website header.
 */
module.exports = class Header extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the header.
	 * @param {String} [context.currentPath='/']
	 *     The path to the current page in the application.
	 * @param {Object} [context.currentUser]
	 *     The user currently logged into the application.
	 * @param {String} context.title
	 *     The header title.
	 */
	constructor(context) {
		super(context);
		this.context.currentPath = this.context.currentPath || '/';
		this.context.navigationItems = [
			{
				label: 'Home',
				url: '/'
			}
		];
		this.context.contextNavigationItems = [];
	}

	/**
	 * Render the header.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the website header.
	 */
	render() {
		const navigationItems = this.context.navigationItems.map(item => {
			return this.renderNavigationItem(item);
		});
		const contextNavigationItems = this.context.contextNavigationItems.map(item => {
			return this.renderNavigationItem(item);
		});
		return html`
			<header class="site-header" data-test="site-header">
				<a class="site-header__name" href="/">
					${this.context.title}
				</a>
				<nav class="site-header__navigation">
					<ul>${navigationItems}</ul>
				</nav>
				<nav class="site-header__navigation site-header__navigation--context">
					<ul>${contextNavigationItems}</ul>
				</nav>
			</header>
		`;
	}

	/**
	 * Render a single navigation item.
	 *
	 * @access private
	 * @param {Object} item
	 *     An object representation of a navigation item.
	 * @returns {Object}
	 *     Returns an HTML element representing the navigation item.
	 */
	renderNavigationItem(item) {
		const {currentPath} = this.context;
		const isCurrentUrl = (
			item.url === '/' ?
				currentPath === item.url :
				currentPath === item.url || currentPath.startsWith(`${item.url}/`)
		);
		return html`
			<li>
				<a
					href=${item.url}
					aria-current=${isCurrentUrl}
					data-test="site-header-nav-link"
				>${item.label}</a>
			</li>
		`;
	}

};
