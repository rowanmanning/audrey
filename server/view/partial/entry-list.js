'use strict';

const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents a list of feed entries.
 */
module.exports = class EntryList extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the entry list.
	 * @param {Array} [context.entries]
	 *     An array of feed entries to render.
	 */
	constructor(context) {
		super(context);
		this.entries = this.context.entries ?? [];
	}

	/**
	 * Render the list of feed entries.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the list of feed entries.
	 */
	render() {
		const entries = this.entries.map(feed => this.renderEntry(feed));
		if (entries.length) {
			return html`
				<ol class="content-list">${entries}</ol>
			`;
		}
		return html`<p>No entries</p>`;
	}

	/**
	 * Render a single feed entry.
	 *
	 * @access private
	 * @param {Object} entry
	 *     An object representation of a feed entry.
	 * @returns {Object}
	 *     Returns an HTML element representing the feed entry.
	 */
	renderEntry(entry) {
		return html`
			<li>
				<article class="content-summary ${entry.isRead ? 'content-summary--read' : ''} content-highlight">
					<header>
						<h2 class="content-summary__headline">
							<a href=${entry.url}>${entry.title}</a>
						</h2>
					</header>
					<footer>
						<p class="content-summary__meta">
							Posted <time datetime=${entry.publishedAt.toISOString()}>TODO ${entry.publishedAt.toISOString()}</time>
							${' '} on <a href=${entry.feed.url}>${entry.feed.title}</a>
							${entry.author ? ` by ${entry.author}` : ''}.
							${entry.isRead ? ` You read this TODO ${entry.readAt.toISOString()}.` : ''}
						</p>
					</footer>
					<p class="content-summary__preview">
						<a href=${entry.url}>Read ${entry.title}</a>.
					</p>
				</article>
			</li>
		`;
	}

};
