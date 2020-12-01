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
	 * @param {Object} [context.feedEntryCounts={}]
	 *     Counts of the number of entries in each feed.
	 */
	constructor(context = {}) {
		context.ordered = false;
		super(context);
		this.feedEntryCounts = context.feedEntryCounts || {};
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
		const counts = this.getCountsForFeed(feed._id);

		let entryCountText = 'no entries';
		if (counts.total > 0) {
			entryCountText = (
				counts.total === 1 ?
					`1 entry` :
					`${counts.total} entries`
			);
		}

		const isRead = (counts.read === counts.total);

		return super.renderItem(html`
			<article class="content-summary ${isRead ? 'content-summary--read' : ''}">
				<header class="content-summary__headline">
					<h2>
						<a href=${feed.url}>${feed.displayTitle}</a>
					</h2>
				</header>
				<p class="content-summary__meta">
					Feed has <a href=${feed.url}>${entryCountText}</a>
					${counts.total > 0 && counts.read > 0 ? `, you have read ${isRead ? 'all' : counts.read} of them.` : '.'}
					${feed.errors && feed.errors.length ? html` <span class="content-summary__error">This feed has errors</span>.` : ''}
				</p>
			</article>
		`);
	}

	getCountsForFeed(feedId) {
		return this.feedEntryCounts[feedId] || {
			total: 0,
			read: 0,
			unread: 0
		};
	}

};
