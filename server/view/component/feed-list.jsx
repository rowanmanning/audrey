'use strict';

const {h, Fragment} = require('@rowanmanning/app/preact');
const ContentList = require('./content-list');

/**
 * Represents a list of feeds.
 */
module.exports = class FeedList extends ContentList {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.ordered = false;
		this.props.feedEntryCounts = this.props.feedEntryCounts || {};
	}

	/**
	 * Render a single feed.
	 *
	 * @access private
	 * @param {Object} feed
	 *     An object representation of a feed.
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the feed.
	 */
	renderItem({
		_id,
		displayTitle,
		errors,
		url
	}) {
		const counts = this.getCountsForFeed(_id);

		let entryCountText = 'no entries';
		if (counts.total > 0) {
			entryCountText = (
				counts.total === 1 ?
					`1 entry` :
					`${counts.total} entries`
			);
		}

		const isRead = (counts.read === counts.total);

		const classList = [
			'content-summary',
			(isRead ? 'content-summary--read' : '')
		];
		return super.renderItem(
			<article data-test="feed-summary" class={classList.join(' ').trim()}>
				<header class="content-summary__headline">
					<h2 data-test="feed-heading">
						<a href={url}>{displayTitle}</a>
					</h2>
				</header>
				<p class="content-summary__meta">
					Feed has <a href={url}>{entryCountText}</a>
					{(
						counts.total > 0 && counts.read > 0 ?
							`, you have read ${isRead ? 'all' : counts.read} of them.` :
							'.'
					)}
					{(
						errors && errors.length ?
							<Fragment>
								{' '}
								<span class="content-summary__error">This feed has errors</span>.
							</Fragment> :
							''
					)}
				</p>
			</article>
		);
	}

	/**
	 * Get the counts for a feed.
	 *
	 * @access private
	 * @param {String} feedId
	 *     The feed's ID.
	 * @returns {Object}
	 *     Returns the feed counts.
	 */
	getCountsForFeed(feedId) {
		return this.props.feedEntryCounts[feedId] || {
			total: 0,
			read: 0,
			unread: 0
		};
	}

};
