'use strict';

const EntryList = require('../partial/list/entries');
const {html} = require('@rowanmanning/app');
const layout = require('../layout/main');

module.exports = function renderHomePage(context) {
	const {entries, request, settings} = context;

	return layout(context, html`
		<header class="content-head hidden">
			<h1 class="content-head__title">${settings.siteTitle}</h1>
		</header>

		<ul>
			<li><a href="/?status=all">All posts</a></li>
			<li><a href="/">Unread</a></li>
			<li><a href="/?status=read">Read</a></li>
		</ul>

		<${EntryList} items=${entries}>
			<p>
				There's nothing to read!<br/>
				<a href="/subscribe">You can subscribe to feeds here</a>.
			</p>
		<//>
	`);
};
