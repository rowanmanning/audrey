'use strict';

const {h, Component} = require('preact');

/**
 * Represents a website header.
 */
module.exports = class HeaderSection extends Component {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.currentPath = this.props.currentPath || '/';
		this.props.navigationItems = [
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
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the website header.
	 */
	render({navigationItems, title}) {
		navigationItems = navigationItems.map(item => this.renderNavigationItem(item));
		return (
			<header role="banner" class="header page-layout">
				<div class="header__inner page-layout__main">

					<a href="/" class="header__site-name">{title}</a>

					<nav role="navigation" class="header__navigation">
						<ul>{navigationItems}</ul>
					</nav>

				</div>
			</header>
		);
	}

	/**
	 * Render a single navigation item.
	 *
	 * @access private
	 * @param {Object} item
	 *     An object representation of a navigation item.
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the navigation item.
	 */
	renderNavigationItem({icon, label, url}) {
		const classList = [
			'header__navigation-item',
			(this.isCurrentUrl(url) ? 'header__navigation-item--selected' : '')
		];
		return (
			<li class={classList.join(' ').trim()}>
				<a
					href={url}
					title={icon ? label : undefined}
					class={icon ? `header__icon header__icon--${icon}` : undefined}
				>{label}</a>
			</li>
		);
	}

	isCurrentUrl(url) {
		const {currentPath} = this.props;
		return (
			url === '/' ?
				currentPath === url :
				currentPath === url || currentPath.startsWith(`${url}/`)
		);
	}

};
