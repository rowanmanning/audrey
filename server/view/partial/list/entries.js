'use strict';

const ContentList = require('./content');
const DateElement = require('../element/date');
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
			<article class="entry-summary ${entry.isRead ? 'entry-summary--read' : ''}">
				<header>
					<h2 class="entry-summary__headline">
						<a href=${entry.url}>${entry.title}</a>
					</h2>
				</header>
				<p class="entry-summary__meta">
					Posted <${DateElement} date=${entry.publishedAt} />
					${' '} on <a href=${entry.feed.url}>${entry.feed.displayTitle}</a>
					${entry.author ? ` by ${entry.author}` : ''}.
					${entry.isRead ? html` You read this <${DateElement} date=${entry.readAt} />.` : ''}
					${' '} <a href=${entry.url}>Read ${entry.title}</a>.
				</p>
			</article>
		`);
	}

};
