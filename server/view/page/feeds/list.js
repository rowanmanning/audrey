'use strict';

const FeedList = require('../../partial/list/feeds');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');
const Pagination = require('../../partial/pagination');

module.exports = function renderFeedsListPage(context) {
	const {feeds, feedPagination, isRefreshInProgress, settings} = context;

	context.pageTitle = 'Feeds';

	// Populate main content
	const content = html`
		<${FeedList} items=${feeds}>
			<div class="notification notification--help">
				<p>
					You haven't subscribed to any feeds yet, once you do they'll appear here. ${' '}
					You can <a href="/subscribe">subscribe to a feed here</a>, or there's a ${' '}
					useful shortcut button in the header above ↑ (look for the orange plus icon).
				</p>
			</div>
		<//>
		<${Pagination} data=${feedPagination} />
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
			${isRefreshInProgress ? displayRefresInProgress() : ''}
			<nav class="nav-list">
				<ul>
					<li>
						<a href="/subscribe" class="nav-list__link">Subscribe to a feed</a>
					</li>
					<li>
						<form method="post" action="/feeds/refresh">
							<input type="submit" class="nav-list__link" value="Refresh all feeds" disabled=${isRefreshInProgress} />${' '}
						</form>
					</li>
				</ul>
			</nav>
		`
	};

	function displayRefresInProgress() {
		return html`
			<div class="notification notification--warning">
				<p>
					Feeds are currently being refreshed. Reload this page in a minute or two
				</p>
			</div>
		`;
	}

	// Right-hand sidebar
	if (feeds.length && settings.showHelpText) {
		context.subSections.rhs = html`
			<div class="notification notification--help">
				<p>
					This page shows all of the feeds you're subscribed to. You can click ${' '}
					a feed to view all entries from it and manage subscriptions.
				</p>
			</div>
		`;
	}

	// Wrap the content in a layout and return to render
	return layout(context, content);
};
