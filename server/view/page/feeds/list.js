'use strict';

const FeedList = require('../../partial/feed-list');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedsListPage(context) {
	const {feeds} = context;

	context.pageTitle = 'Feeds';

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>
		<form method="post" action="${context.currentPath}">
			<input type="url" name="url" />
			<input type="submit" value="Add feed" />
		</form>
		<${FeedList} feeds=${feeds} />
	`);
};
