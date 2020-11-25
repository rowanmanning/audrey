'use strict';

const EntryList = require('../../partial/list/entries');
const FeedErrorList = require('../../partial/feed-error-list');
const Form = require('../../partial/form');
const DateElement = require('../../partial/element/date');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedsViewPage(context) {
	const {feed, refreshFeedForm} = context;

	context.pageTitle = feed.displayTitle;

	// Add breadcrumbs
	context.breadcrumbs.push({
		label: 'Feeds',
		url: '/feeds'
	});

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>
		
		<nav class="nav-bar">
			<ul>
			
				<li class="nav-bar__item">
					<a
						class="
							nav-bar__link
							nav-bar__link--website
							${context.request.path === feed.url ? 'nav-bar__link--selected' : ''}
						"
						href=${feed.url}
					>Entries</a>
				</li>

				<li class="nav-bar__item">
					<a
						class="
							nav-bar__link
							nav-bar__link--settings
							${context.request.path === feed.settingsUrl ? 'nav-bar__link--selected' : ''}
						"
						href=${feed.settingsUrl}
					>Settings</a>
				</li>

				<li class="nav-bar__item">
					<a class="nav-bar__link nav-bar__link--website" href=${feed.htmlUrl}>
						View feed website
					</a>
				</li>

				<li class="nav-bar__item">
					<form method="post" action=${refreshFeedForm.action}>
						<input type="submit" value="Refresh feed" />${' '}
						(last refreshed <${DateElement} date=${feed.syncedAt} />)
					</form>
				</li>
				
			</ul>
		</nav>
		
		<${Form.Errors} errors=${refreshFeedForm.errors} />
		<${FeedErrorList} errors=${feed.errors} />

		<${EntryList} items=${feed.entries}>
			<p>
				This feed hasn't posted anything in a while, we don't have any content for it. ${' '}
				<a href="/subscribe">You can subscribe to more feeds here</a>, or ${' '}
				<a href="/settings">update your retention settings here</a>.
			</p>
		<//>
	`);
};
