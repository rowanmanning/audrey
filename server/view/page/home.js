'use strict';

const EntryList = require('../partial/list/entries');
const {html} = require('@rowanmanning/app');
const layout = require('../layout/main');
const Pagination = require('../partial/pagination');

module.exports = function renderHomePage(context) {
	const {entries, entryPagination, nextPage, settings, totalFeedCount} = context;

	// Populate main content
	const content = html`
		<${Pagination.Description} date=${entryPagination.before} resetUrl="/" />
		<${EntryList} items=${entries}>
			${totalFeedCount ? renderNothingToRead() : renderWelcome()}
		<//>
		<${Pagination.Next} url=${nextPage}>
			View earlier entries
		<//>
	`;

	// Render a welcome message
	function renderWelcome() {
		return html`
			<div class="notification notification--help" data-test="welcome-message">
				<p><strong>Welcome to ${settings.siteTitle}!</strong></p>
				<p>
					To get started, the first thing you'll need to do is ${' '}
					<a href="/subscribe">subscribe to a feed</a>. There's a useful ${' '}
					shortcut button in the header above ↑ (look for the orange plus icon).
				</p>
				<p>
					You can also visit the <a href="/settings">settings page</a> ${' '}
					to configure ${settings.siteTitle} just the way you like it. See the ${' '}
					green cog icon in the header.
				</p>
			</div>
		`;
	}

	// Render a "nothing to read" message
	function renderNothingToRead() {
		return html`
			<div class="content-body" data-test="no-entries-message">
				<h2>You read everything</h2>
				<p>
					There's nothing new to read at the moment, you read it all! If you're
					looking for more content, try ${' '}
					<a href="/subscribe">subscribing to more feeds</a>.
				</p>
			</div>
		`;
	}

	// Populate content sub-sections
	context.subSections = {

		// Content heading
		hideHeading: true,
		heading: html`
			<div class="content-head">
				<h1 class="content-head__title">${settings.siteTitle}</h1>
			</div>
		`
	};

	// Right-hand sidebar
	if (totalFeedCount && settings.showHelpText) {
		context.subSections.rhs = html`
			<div class="notification notification--help">
				<p>
					This is the main page, showing entries from all feeds that you have not ${' '} 
					yet read. <a href="/entries">You can find <em>all</em> entries here</a>.
				</p>
			</div>
		`;
	}

	// Wrap the content in a layout and return to render
	return layout(context, content);
};
