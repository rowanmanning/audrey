'use strict';

const Breadcrumb = require('../../partial/breadcrumb');
const FeedList = require('../../partial/list/feeds');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedsListPage(context) {
	const {feeds, feedEntryCounts, isRefreshInProgress, request, settings} = context;

	context.pageTitle = 'Feeds';

	// Populate main content
	const content = html`
		${showUnsubscribeSuccess()}
		${isRefreshInProgress ? displayRefreshInProgress() : ''}
		<${FeedList} items=${feeds} feedEntryCounts=${feedEntryCounts}>
			<div class="notification notification--help" data-test="no-feeds-message">
				<p>
					You haven't subscribed to any feeds yet, once you do they'll appear here. ${' '}
					You can <a href="/subscribe">subscribe to a feed here</a>, or there's a ${' '}
					useful shortcut button in the header above ↑ (look for the orange plus icon).
				</p>
			</div>
		<//>
	`;

	// Populate content sub-sections
	context.subSections = {

		// Content heading
		heading: html`
			<${Breadcrumb} items=${context.breadcrumbs} />
			<div class="content-head">
				<h1 class="content-head__title">${context.pageTitle}</h1>
				<nav class="content-head__navigation">
					<ul>
						<li>
							<a
								href="/subscribe"
								class="content-head__link content-head__link--subscribe"
								title="Subscribe to a feed"
							>Subscribe</a>
						</li>
						<li>
							<form method="post" action="/feeds/refresh">
								<input
									type="submit"
									value="Refresh"
									disabled=${isRefreshInProgress}
									class="content-head__link content-head__link--refresh"
									title="Refresh all feeds"
								/>
							</form>
						</li>
					</ul>
				</nav>
			</div>
		`
	};

	function displayRefreshInProgress() {
		return html`
			<div class="notification notification--warning" data-test="feeds-refreshing-message">
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

	function showUnsubscribeSuccess() {
		const flashMessage = request.flash('unsubscribed');
		if (flashMessage && flashMessage.length) {
			return html`
				<div class="notification notification--success">
					<p>
						You have successfully unsubscribed from "${flashMessage.pop()}".
					</p>
				</div>
			`;
		}
		return '';
	}

	// Wrap the content in a layout and return to render
	return layout(context, content);
};
