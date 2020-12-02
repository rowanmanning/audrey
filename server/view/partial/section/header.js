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
	 * @param {String} context.title
	 *     The header title.
	 */
	constructor(context) {
		super(context);
		this.context.currentPath = this.context.currentPath || '/';
		this.context.navigationItems = [
			{
				label: 'Unread',
				url: '/'
			},
			{
				label: 'All',
				url: '/entries'
			},
			{
				label: 'Bookmarks',
				url: '/bookmarks'
			},
			{
				label: 'Feeds',
				url: '/feeds'
			},
			{
				label: 'Subscribe',
				url: '/subscribe',
				icon: 'subscribe'
			},
			{
				label: 'Settings',
				url: '/settings',
				icon: 'settings'
			}
		];
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
		return html`
			<header role="banner" class="header page-layout">
				<div class="header__inner page-layout__main">

					<a href="/" class="header__site-name">
						${this.context.title}
					</a>

					<nav role="navigation" class="header__navigation">
						<ul>${navigationItems}</ul>
					</nav>

				</div>
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
		const {label, url, icon} = item;
		const isCurrentUrl = (
			url === '/' ?
				currentPath === url :
				currentPath === url || currentPath.startsWith(`${url}/`)
		);
		return html`
			<li class="
				header__navigation-item
				${isCurrentUrl ? 'header__navigation-item--selected' : ''}
			">
				<a
					href=${url}
					title=${icon ? label : undefined}
					class=${icon ? `header__icon header__icon--${icon}` : undefined}
				>${label}</a>
			</li>
		`;
	}

};
