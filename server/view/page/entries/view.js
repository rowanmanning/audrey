'use strict';

const DateElement = require('../../partial/element/date');
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

	// Populate main content
	const content = html`
		<div class="content-body" dangerouslySetInnerHTML=${{__html: entry.cleanContent}}></div>
	`;

	// Populate content sub-sections
	context.subSections = {

		// Content heading
		heading: html`
			<div class="content-head">
				<h1 class="content-head__title">${context.pageTitle}</h1>
			</div>
		`,

		// Right-hand sidebar
		rhs: html`
			<div class="notification notification--info notification--small">
				<p>
					This entry was posted on ${' '}
					<a href=${entry.feed.url}>${entry.feed.title}</a> ${' '}
					<${DateElement} date=${entry.publishedAt} />.
				</p>
				${entry.author ? html`<p>Authored by ${entry.author}.</p>` : ''}
				${entry.isRead ? html`<p>You read this <${DateElement} date=${entry.readAt} /></p>` : ''}
			</div>
			<nav class="nav-list">
				<ul>
					<li>
						<a href=${entry.htmlUrl} class="nav-list__link">View on website</a>
					</li>
					<li>
						<form method="post" action=${entry.markUrl}>
							<input type="hidden" name="setReadStatus" value=${entry.isRead ? 'unread' : 'read'} />
							<input type="submit" class="nav-list__link" value="Mark as ${entry.isRead ? 'unread' : 'read'}" />
						</form>
					</li>
				</ul>
			</nav>
		`
	};

	// Wrap the content in a layout and return to render
	return layout(context, content);
};
