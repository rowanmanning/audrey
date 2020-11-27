'use strict';

const ContentList = require('./content');
const {html} = require('@rowanmanning/app');

/**
 * Represents a list of feeds.
 */
module.exports = class FeedList extends ContentList {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the feed list.
	 */
	constructor(context = {}) {
		context.ordered = false;
		super(context);
	}

	/**
	 * Render a single feed.
	 *
	 * @access private
	 * @param {Object} feed
	 *     An object representation of an feed.
	 * @returns {Object}
	 *     Returns an HTML element representing the feed.
	 */
	renderItem(feed) {
		return super.renderItem(html`
			<article class="feed-summary">
				<header>
					<h2 class="feed-summary__headline">
						<a href=${feed.url}>${feed.displayTitle}</a>
					</h2>
				</header>
				<p class="feed-summary__meta">
					<a href=${feed.url}>Read entries from this feed</a> ${' | '}
					<a href=${feed.htmlUrl || feed.xmlUrl}>View the feed website</a> ${' | '}
					<a href=${feed.settingsUrl}>Feed settings</a>
					${feed.errors && feed.errors.length ? ` | ${feed.errors.length} errors` : ''}
				</p>
			</article>
		`);
	}

};
