'use strict';

const EntryList = require('../../partial/entry-list');
const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedsViewPage(context) {
	const {entries, feed, refreshFeedForm} = context;

	context.pageTitle = feed.title;

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>
		<ul>
			<li><a href=${feed.htmlUrl}>View feed website</a></li>
		</ul>
		<${Form} action=${refreshFeedForm.action}>
			<${Form.Errors} errors=${refreshFeedForm.errors} />
			<${Form.Submit} label="Refresh feed" />
		<//>
		<${EntryList} entries=${entries} />
	`);
};
