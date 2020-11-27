'use strict';

const EntryList = require('../../partial/list/entries');
const FeedErrorList = require('../../partial/feed-error-list');
const DateElement = require('../../partial/element/date');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');
const Pagination = require('../../partial/pagination');

module.exports = function renderFeedsViewPage(context) {
	const {entries, entryPagination, feed, settings} = context;

	context.pageTitle = feed.displayTitle;

	// Add breadcrumbs
	context.breadcrumbs.push({
		label: 'Feeds',
		url: '/feeds'
	});

	// Populate main content
	const content = html`
		<${FeedErrorList} errors=${feed.errors} />
		<${EntryList} items=${entries}>
			<div class="notification notification--help">
				<p>
					This feed doesn't have any entries. This might be because nothing has ${' '}
					been published in your configured retention period, you can change ${' '}
					retention times on the <a href="/settings">settings page</a>.
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
		`,

		// Left-hand sidebar
		lhs: html`
			<nav class="nav-list">
				<ul>
					<li>
						<a href=${feed.url} class="nav-list__link">Entries</a>
					</li>
					<li>
						<a href=${feed.settingsUrl} class="nav-list__link">Feed settings</a>
					</li>
					<li>
						<form method="post" action=${feed.refreshUrl}>
							<input type="submit" class="nav-list__link" value="Refresh feed" />${' '}
						</form>
					</li>
				</ul>
			</nav>
		`,

		// Right-hand sidebar
		rhs: html`
			${showHelpText()}
			<div class="notification notification--info notification--small">
				<p>
					This feed was last refreshed ${' '}
					<${DateElement} date=${feed.syncedAt} />.
				</p>
				${feed.author ? html`<p>Authored by ${feed.author}.</p>` : ''}
			</div>
			<nav class="nav-list">
				<ul>
					<li>
						<a class="nav-list__link" href=${feed.htmlUrl}>View feed website</a>
					</li>
					<li>
						<a class="nav-list__link" href=${feed.xmlUrl}>View raw feed XML</a>
					</li>
				</ul>
			</nav>
		`
	};

	// Right-hand sidebar
	function showHelpText() {
		if (entries.length && settings.showHelpText) {
			return html`
				<div class="notification notification--help">
					<p>
						This page shows all of the entries for the feed "${feed.title}". ${' '}
						From here you can read, refresh, and configure the feed.
					</p>
				</div>
			`;
		}
		return '';
	}

	// Wrap the content in a layout and return to render
	return layout(context, content);
};
