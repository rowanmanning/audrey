'use strict';

const Breadcrumb = require('../../partial/breadcrumb');
const DateElement = require('../../partial/element/date');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderEntriesViewPage(context) {
	const {entry} = context;

	context.pageTitle = entry.displayTitle;

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
			<${Breadcrumb} items=${context.breadcrumbs} />
			<div class="content-head">
				<h1 class="content-head__title">${context.pageTitle}</h1>
				<nav class="content-head__navigation">
					<ul>
						<li>
							<form method="post" action=${entry.markUrl}>
								<input
									type="hidden"
									name="setStatus"
									value=${entry.isRead ? 'unread' : 'read'}
								/>
								<input
									type="submit"
									value="Mark as ${entry.isRead ? 'unread' : 'read'}"
									class="content-head__link content-head__link--${entry.isRead ? 'unread' : 'read'}"
									title="Mark this entry as ${entry.isRead ? 'unread' : 'read'}"
								/>
							</form>
						</li>
						<li>
							<form method="post" action=${entry.markUrl}>
								<input
									type="hidden"
									name="setStatus"
									value=${entry.isBookmarked ? 'unbookmark' : 'bookmark'}
								/>
								<input
									type="submit"
									value="${entry.isBookmarked ? 'Remove bookmark' : 'Bookmark'}"
									class="content-head__link content-head__link--${entry.isBookmarked ? 'unbookmarked' : 'bookmarked'}"
									title="${entry.isBookmarked ? 'Remove bookmark' : 'Bookmark'}"
								/>
							</form>
						</li>
					</ul>
				</nav>
			</div>
		`,

		// Right-hand sidebar
		rhs: html`
			<div class="notification notification--info notification--small">
				<p>
					This entry was posted on ${' '}
					<a href=${entry.feed.url}>${entry.feed.displayTitle}</a> ${' '}
					<${DateElement} date=${entry.publishedAt} />.
				</p>
				${entry.author ? html`<p>Authored by ${entry.author}.</p>` : ''}
				${entry.isRead ? html`<p>You read this <${DateElement} date=${entry.readAt} />.</p>` : ''}
				${entry.isBookmarked ? html`<p>You bookmarked this <${DateElement} date=${entry.bookmarkedAt} />.</p>` : ''}
			</div>
			<nav class="nav-list">
				<ul>
					<li>
						<a href=${entry.htmlUrl} class="nav-list__link">View on website</a>
					</li>
					<li>
						<a href=${entry.feed.xmlUrl} class="nav-list__link">View raw feed XML</a>
					</li>
				</ul>
			</nav>
		`
	};

	// Wrap the content in a layout and return to render
	return layout(context, content);
};
