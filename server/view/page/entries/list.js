'use strict';

const EntryList = require('../../partial/list/entries');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');
const Pagination = require('../../partial/pagination');

module.exports = function renderEntryiesListPage(context) {
	const {entries, entryPagination, settings} = context;

	context.pageTitle = 'Entries';

	// Populate main content
	const content = html`
		<${EntryList} items=${entries}>
			<div class="notification notification--help">
				<p>
					There are no entries here. This might be because you haven't ${' '}
					<a href="/subscribe">subscribed</a> to any feeds yet. You may also have ${' '}
					${settings.siteTitle} configured to not retain entries for very long; ${' '}
					you can change the retention period on the ${' '}
					<a href="/settings">settings page</a>.
				</p>
			</div>
		<//>
		<${Pagination} data=${entryPagination} />
	`;

	// Populate content sub-sections
	context.subSections = {

		// Content heading
		heading: html`
			<div class="content-head">
				<h1 class="content-head__title">${context.pageTitle}</h1>
			</div>
		`
	};

	// Right-hand sidebar
	if (entries.length && settings.showHelpText) {
		context.subSections.rhs = html`
			<div class="notification notification--help">
				<p>
					This page displays all entries from all feeds, including those ${' '}
					you have already read. ${' '}
					<a href="/">You can view only <em>unread</em> entries here</a>.
				</p>
			</div>
		`;
	}

	// Wrap the content in a layout and return to render
	return layout(context, content);
};
