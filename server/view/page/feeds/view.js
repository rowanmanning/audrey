'use strict';

const EntryList = require('../../partial/entry-list');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedsViewPage(context) {
	const {entries, feed} = context;

	context.pageTitle = feed.title;

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>
		<ul>
			<li><a href=${feed.htmlUrl}>View feed website</a></li>
			<li>
				<form method="post" action="${feed.url}/sync">
					<input type="submit" value="Sync" />
				</form>
			</li>
		</ul>
		<${EntryList} entries=${entries} />
	`);
};
