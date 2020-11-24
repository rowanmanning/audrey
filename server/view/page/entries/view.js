'use strict';

const FormattedDate = require('../../partial/formatted-date');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderEntriesViewPage(context) {
	const {entry} = context;

	context.pageTitle = entry.title;

	// Add breadcrumbs
	context.breadcrumbs.push({
		label: 'Feeds',
		url: '/feeds'
	});
	context.breadcrumbs.push({
		label: entry.feed.displayTitle,
		url: entry.feed.url
	});

	const cleanContent = {__html: entry.cleanContent};

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>

			<div class="content-head__meta content-highlight">

				<p>
					Posted <${FormattedDate} date=${entry.publishedAt} />
					${' '} on <a href=${entry.feed.url}>${entry.feed.title}</a>
					${entry.author ? ` by ${entry.author}` : ''}.
					${entry.isRead ? html` You read this <${FormattedDate} date=${entry.readAt} />.` : ''}
				</p>

				<ul class="content-head__actions">
					<li><a href=${entry.htmlUrl}>View on website</a></li>
					<li>
						<form method="post" action=${entry.markUrl}>
							<input type="hidden" name="setReadStatus" value=${entry.isRead ? 'unread' : 'read'} />
							<input type="submit" value="Mark as ${entry.isRead ? 'unread' : 'read'}" />
						</form>
					</li>
				</ul>

			</p>
		</header>
		<div class="content-body" dangerouslySetInnerHTML=${cleanContent}></div>
	`);
};
