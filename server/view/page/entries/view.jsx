'use strict';

const Breadcrumbs = require('../../component/breadcrumbs');
const Enclosure = require('../../component/enclosure');
const {h, Component, Fragment} = require('@rowanmanning/app/preact');
const MainLayout = require('../../layout/main');
const Notification = require('../../component/notification');
const RelativeDate = require('../../component/relative-date');

module.exports = class EntriesViewPage extends Component {

	render(props) {
		const {breadcrumbs, entry} = props;

		props.pageTitle = entry.displayTitle;

		// Add breadcrumbs
		props.breadcrumbs.push({
			label: 'Feeds',
			url: '/feeds'
		});
		props.breadcrumbs.push({
			label: entry.feed.displayTitle,
			url: entry.feed.url
		});

		// Populate main content
		const content = [];

		// Enclosures
		if (entry.enclosures && entry.enclosures.length) {
			for (const enclosure of entry.enclosures) {
				content.push(<Enclosure enclosure={enclosure} entry={entry} />);
			}
		}

		// Main text content
		if (entry.content) {
			let html = entry.cleanContent;
			if (!entry.contentContainsHTMLTag) {
				html += ` <a href="${entry.htmlUrl}">Read this entry on ${entry.feed.displayTitle}</a>`;
			}
			content.push(
				<div
					class="content-body"
					data-test="entry-content"
					dangerouslySetInnerHTML={{__html: html}}
				/>
			);
		}

		// No content
		if (!content.length) {
			content.push(
				<div class="content-body">
					<p>
						This entry does not have any content. {' '}
						<a href={entry.htmlUrl}>Try viewing it on the original website</a>.
					</p>
				</div>
			);
		}

		// Populate content sub-sections
		props.subSections = {

			// Content heading
			heading: (
				<Fragment>
					<Breadcrumbs items={breadcrumbs} />
					<div class="content-head">
						<h1 class="content-head__title" data-test="entry-heading">
							{props.pageTitle}
						</h1>
						<nav class="content-head__navigation">
							<ul>
								<li>
									<form method="post" action={entry.markUrl}>
										<input
											type="hidden"
											name="setStatus"
											value={entry.isRead ? 'unread' : 'read'}
										/>
										<input
											type="submit"
											value={entry.isRead ? 'Mark as unread' : 'Mark as read'}
											class={[
												'content-head__link',
												`content-head__link--${entry.isRead ? 'unread' : 'read'}`
											].join(' ').trim()}
											title={(
												entry.isRead ?
													'Mark this entry as unread' :
													'Mark this entry as read'
											)}
										/>
									</form>
								</li>
								<li>
									<form method="post" action={entry.markUrl}>
										<input
											type="hidden"
											name="setStatus"
											value={entry.isBookmarked ? 'unbookmark' : 'bookmark'}
										/>
										<input
											type="submit"
											value={(
												entry.isBookmarked ?
													'Remove bookmark' :
													'Bookmark'
											)}
											class={[
												'content-head__link',
												`content-head__link--${entry.isBookmarked ? 'unbookmarked' : 'bookmarked'}`
											].join(' ').trim()}
											title={(
												entry.isBookmarked ?
													'Remove bookmark' :
													'Bookmark'
											)}
										/>
									</form>
								</li>
							</ul>
						</nav>
					</div>
				</Fragment>
			),

			// Right-hand sidebar
			rhs: (
				<Fragment>
					<Notification type="info">
						<p>
							This entry was posted on {' '}
							<a href={entry.feed.url}>{entry.feed.displayTitle}</a> {' '}
							<RelativeDate date={entry.publishedAt} />.
						</p>
						{(
							entry.author ?
								<p>Authored by {entry.author}.</p> :
								''
						)}
						{(
							entry.isRead ?
								<p>You read this <RelativeDate date={entry.readAt} />.</p> :
								''
						)}
						{(
							entry.isBookmarked ?
								<p>You bookmarked this <RelativeDate date={entry.bookmarkedAt} />.</p> :
								''
						)}
					</Notification>
					<nav class="nav-list">
						<ul>
							<li>
								<a href={entry.issueUrl} class="nav-list__link">Report a formatting issue</a>
							</li>
							<li>
								<a href={entry.htmlUrl} class="nav-list__link">View on website</a>
							</li>
							<li>
								<a href={entry.feed.xmlUrl} class="nav-list__link">View raw feed XML</a>
							</li>
						</ul>
					</nav>
				</Fragment>
			)
		};

		// Populate main content
		return (
			<MainLayout {...props}>{content}</MainLayout>
		);
	}

};
