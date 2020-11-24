'use strict';

const EntryList = require('../partial/entry-list');
const {html} = require('@rowanmanning/app');
const layout = require('../layout/main');

module.exports = function renderHomePage(context) {
	const {entries, settings} = context;

	console.log('REQUEST', context);

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${settings.siteTitle}</h1>
		</header>

		<ul>
			<li><a href="/?status=all">All posts</a></li>
			<li><a href="/">Unread</a></li>
			<li><a href="/?status=read">Read</a></li>
		</ul>

		<${EntryList} entries=${entries} />
	`);
};
