'use strict';

const ContentList = require('./content');
const RelativeDate = require('../element/relative-date');
const {html} = require('@rowanmanning/app');

/**
 * Represents a list of entries.
 */
module.exports = class EntryList extends ContentList {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the entry list.
	 */
	constructor(context = {}) {
		context.ordered = true;
		super(context);
	}

	/**
	 * Render a single entry.
	 *
	 * @access private
	 * @param {Object} entry
	 *     An object representation of an entry.
	 * @returns {Object}
	 *     Returns an HTML element representing the entry.
	 */
	renderItem(entry) {
		return super.renderItem(html`
			<article
				data-test="entry-summary"
				class="
					content-summary
					${entry.isRead ? 'content-summary--read' : ''}
					${entry.isBookmarked ? 'content-summary--bookmarked' : ''}
				"
			>
				<header class="content-summary__headline">
					<h2 data-test="entry-heading">
						<a href=${entry.url}>${entry.displayTitle}</a>
					</h2>
				</header>
				<p class="content-summary__meta">
					Posted <${RelativeDate} date=${entry.publishedAt} />
					${entry.author ? ` by ${entry.author}` : ''}
					${' '} on <a href=${entry.feed.url}>${entry.feed.displayTitle}</a>.
					${entry.isRead ? html`
						${' '} Read <${RelativeDate} date=${entry.readAt} />.
					` : ''}
					${entry.isBookmarked ? html`
						${' '} Bookmarked <${RelativeDate} date=${entry.bookmarkedAt} />.
					` : ''}
				</p>
			</article>
		`);
	}

};
