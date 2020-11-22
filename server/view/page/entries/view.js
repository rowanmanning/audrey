'use strict';

const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderEntriesViewPage(context) {
	const {entry} = context;

	context.pageTitle = entry.title;

	const cleanContent = {__html: entry.cleanContent};

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>

			<div class="content-head__meta content-highlight">

				<p>
					Posted <time datetime=${entry.publishedAt.toISOString()}>TODO ${entry.publishedAt.toISOString()}</time>
					${' '} on <a href=${entry.feed.url}>${entry.feed.title}</a>
					${entry.author ? ` by ${entry.author}` : ''}.
					${entry.isRead ? ` You read this TODO ${entry.readAt.toISOString()}.` : ''}
				</p>

				<ul class="content-head__actions">
					<li><a href=${entry.htmlUrl}>View on website</a></li>
					<li>TODO mark as unread</li>
					<li>TODO report a formatting issue</li>
				</ul>

			</p>
		</header>
		<div dangerouslySetInnerHTML=${cleanContent}></div>
	`);
};
