'use strict';

const FeedList = require('../../partial/list/feeds');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedsListPage(context) {
	const {feeds, isRefreshInProgress} = context;

	context.pageTitle = 'Feeds';

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>

		<ul>
			<li><a href="/subscribe">Subscribe to a feed</a></li>
			<li>
				<form method="post" action="/feeds/refresh">
					<input type="submit" value="Refresh all feeds" disabled=${isRefreshInProgress} />${' '}
				</form>
			</li>
		</ul>

		${isRefreshInProgress ? html`<p>Feeds are currently being refreshed. Reload this page in a minute or two</p>` : ''}

		<${FeedList} items=${feeds} />
	`);
};
