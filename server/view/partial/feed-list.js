'use strict';

const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents a list of feeds.
 */
module.exports = class FeedList extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the feed list.
	 * @param {Array} [context.feeds]
	 *     An array of feeds to render.
	 */
	constructor(context) {
		super(context);
		this.feeds = this.context.feeds ?? [];
	}

	/**
	 * Render the list of feeds.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the list of feeds.
	 */
	render() {
		const feeds = this.feeds.map(feed => this.renderFeed(feed));
		if (feeds.length) {
			return html`
				<ul>${feeds}</ul>
			`;
		}
		return html`<p>No feeds</p>`;
	}

	/**
	 * Render a single feed.
	 *
	 * @access private
	 * @param {Object} feed
	 *     An object representation of a feed.
	 * @returns {Object}
	 *     Returns an HTML element representing the feed.
	 */
	renderFeed(feed) {
		return html`
			<li>
				<a href=${feed.url}>${feed.displayTitle}</a>
			</li>
		`;
	}

};
