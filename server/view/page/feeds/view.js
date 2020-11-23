'use strict';

const EntryList = require('../../partial/entry-list');
const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedsViewPage(context) {
	const {entries, feed, refreshFeedForm} = context;

	context.pageTitle = feed.displayTitle;

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>
		<ul>
			<li><a href=${feed.htmlUrl}>View feed website</a></li>
			<li><a href=${feed.editUrl}>Edit feed</a></li>
			<li><a href=${feed.deleteUrl}>Delete feed</a></li>
			<li>
				<form method="post" action=${refreshFeedForm.action}>
					<input type="submit" value="Refresh feed" />
				</form>
			</li>
		</ul>
		<${Form.Errors} errors=${refreshFeedForm.errors} />
		<${EntryList} entries=${entries} />
	`);
};
