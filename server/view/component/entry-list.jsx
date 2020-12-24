'use strict';

const {h} = require('@rowanmanning/app/preact');
const ContentList = require('./content-list');
const RelativeDate = require('./relative-date');

/**
 * Represents a list of entries.
 */
module.exports = class EntryList extends ContentList {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.ordered = true;
	}

	/**
	 * Render a single entry.
	 *
	 * @access private
	 * @param {Object} entry
	 *     An object representation of an entry.
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the entry.
	 */
	renderItem({
		author,
		bookmarkedAt,
		displayTitle,
		feed,
		isBookmarked,
		isRead,
		publishedAt,
		readAt,
		url
	}) {
		const classList = [
			'content-summary',
			(isRead ? 'content-summary--read' : ''),
			(isBookmarked ? 'content-summary--bookmarked' : '')
		];
		return super.renderItem(
			<article data-test="entry-summary" class={classList.join(' ').trim()}>
				<header class="content-summary__headline">
					<h2 data-test="entry-heading">
						<a href={url}>{displayTitle}</a>
					</h2>
				</header>
				<p class="content-summary__meta">
					Posted <RelativeDate date={publishedAt} />
					{author ? ` by ${author} ` : ' '}
					on <a href={feed.url}>{feed.displayTitle}</a>.
					{isRead ? [' Read ', <RelativeDate date={readAt} />, '.'] : ''}
					{isBookmarked ? [' Bookmarked ', <RelativeDate date={bookmarkedAt} />, '.'] : ''}
				</p>
			</article>
		);
	}

};
