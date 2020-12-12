'use strict';

const Breadcrumb = require('../../partial/breadcrumb');
const EntryList = require('../../partial/list/entries');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');
const Pagination = require('../../partial/pagination');

module.exports = function renderBookmarksListPage(context) {
	const {bookmarkCount, entries, entryPagination, nextPage, settings} = context;

	context.pageTitle = 'Bookmarked Entries';

	// Populate main content
	const content = html`
		<${Pagination.Description} date=${entryPagination.before} resetUrl="/bookmarks" />
		<${EntryList} items=${entries}>
			<div class="notification notification--help" data-test="no-bookmarks-message">
				<p>
					You haven't bookmarked any entries yet. Bookmarking an entry
					means it will never be deleted from ${settings.siteTitle}, so
					you can come back at any time and read it. You can find a
					bookmark button at the top of each entry you read.
				</p>
			</div>
		<//>
		<${Pagination.Next} url=${nextPage}>
			View earlier bookmarks
		<//>
	`;

	// Populate content sub-sections
	context.subSections = {

		// Content heading
		heading: html`
			<${Breadcrumb} items=${context.breadcrumbs} />
			<div class="content-head">
				<h1 class="content-head__title">${context.pageTitle}</h1>
			</div>
		`,

		// Right-hand sidebar
		rhs: (entries.length ? html`
			${showHelpText()}
			<div class="notification notification--info">
				<p>
					You have bookmarked ${bookmarkCount} entries.
				</p>
			</div>
			<nav class="nav-list">
				<ul>
					<li>
						<a class="nav-list__link" href="/bookmarks/export/html">Export as HTML</a>
					</li>
				</ul>
			</nav>
		` : '')
	};

	// Right-hand sidebar
	function showHelpText() {
		if (settings.showHelpText) {
			return html`
				<div class="notification notification--help">
					<p>
						This page displays all entries that you have bookmarked. Bookmarking
						an entry means that it will never be deleted from ${settings.siteTitle}.
					</p>
				</div>
			`;
		}
		return '';
	}

	// Wrap the content in a layout and return to render
	return layout(context, content);
};
