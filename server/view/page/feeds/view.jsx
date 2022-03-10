'use strict';

const Breadcrumbs = require('../../component/breadcrumbs');
const EntryList = require('../../component/entry-list');
const FeedErrorList = require('../../component/feed-error-list');
const {h, Component, Fragment} = require('preact');
const MainLayout = require('../../layout/main');
const Notification = require('../../component/notification');
const PaginationDescription = require('../../component/pagination/description');
const PaginationNextButton = require('../../component/pagination/next-button');
const RelativeDate = require('../../component/relative-date');

module.exports = class FeedViewPage extends Component {

	render(props) {
		const {breadcrumbs, entries, entryPagination, feed, feedIsRead, nextPage, request, settings} = props;

		props.pageTitle = feed.displayTitle;

		// Add breadcrumbs
		breadcrumbs.push({
			label: 'Feeds',
			url: '/feeds'
		});

		// Show feed help text
		function showHelpText() {
			if (entries.length && settings.showHelpText) {
				return (
					<Notification type="help">
						<p>
							This page shows all of the entries for the feed
							"{feed.displayTitle}". From here you can read,
							refresh, and configure the feed.
						</p>
					</Notification>
				);
			}
			return '';
		}

		// Show a subscription success message
		function showSubscriptionSuccess() {
			const flashMessage = request.flash('subscribed');
			if (flashMessage && flashMessage.length) {
				return (
					<Notification type="success" testId="subscribe-success">
						<p>
							You subscribed to "{feed.displayTitle}"! {' '}
							You can view entries for this feed on this page. {' '}
							To view entries for all feeds, head to {' '}
							<a href="/">the Unread page</a>.
						</p>
					</Notification>
				);
			}
			return '';
		}

		// Show a refresh success message
		function showRefreshSuccess() {
			const flashMessage = request.flash('refreshed');
			if (flashMessage && flashMessage.length) {
				return (
					<Notification type="success" testId="refresh-success">
						<p>
							This feed has been refreshed.
						</p>
					</Notification>
				);
			}
			return '';
		}

		// Populate content sub-sections
		props.subSections = {

			// Content heading
			heading: (
				<Fragment>
					<Breadcrumbs items={breadcrumbs} />
					<div class="content-head">
						<h1 class="content-head__title" data-test="feed-heading">{props.pageTitle}</h1>
						<nav class="content-head__navigation">
							<ul>
								<li>
									<a
										href={feed.settingsUrl}
										class="content-head__link content-head__link--settings"
										title="Feed settings"
									>Feed settings</a>
								</li>
								<li>
									<form method="post" action={feed.refreshUrl}>
										<input
											type="submit"
											value="Refresh feed"
											class="content-head__link content-head__link--refresh"
											title="Refresh feed"
										/>
									</form>
								</li>
								{entries.length ? (
									<li>
										<form method="post" action={feed.markUrl}>
											<input
												type="hidden"
												name="setStatus"
												value={feedIsRead ? 'unread' : 'read'}
											/>
											<input
												type="submit"
												value={(
													feedIsRead ?
														'Mark all as unread' :
														'Mark all as read'
												)}
												class={[
													'content-head__link',
													`content-head__link--${feedIsRead ? 'unread' : 'read'}`
												].join(' ').trim()}
												title={`Mark all entries in this feed as ${feedIsRead ? 'unread' : 'read'}`}
											/>
										</form>
									</li>
								) : ''}
							</ul>
						</nav>
					</div>
				</Fragment>
			),

			// Right-hand sidebar
			rhs: (
				<Fragment>
					{showHelpText()}
					<div class="notification notification--info">
						<p>
							This feed was last refreshed {' '}
							<RelativeDate date={feed.syncedAt} />.
						</p>
						{feed.author ? <p>Authored by {feed.author}.</p> : ''}
					</div>
					<nav class="nav-list">
						<ul>
							<li>
								<a class="nav-list__link" href={feed.htmlUrl}>View feed website</a>
							</li>
							<li>
								<a class="nav-list__link" href={feed.xmlUrl}>View raw feed XML</a>
							</li>
						</ul>
					</nav>
				</Fragment>
			)
		};

		// Populate main content
		return (
			<MainLayout {...props}>
				{showRefreshSuccess()}
				{showSubscriptionSuccess()}
				<FeedErrorList errors={feed.errors} />
				<PaginationDescription date={entryPagination.before} resetUrl={feed.url} />
				<EntryList items={entries}>
					<Notification type="help" testId="no-entries-message">
						<p>
							This feed doesn't have any entries. This might be because nothing has
							been published in your configured retention period, you can change
							retention times on the <a href="/settings">settings page</a>.
						</p>
					</Notification>
				</EntryList>
				<PaginationNextButton url={nextPage}>View earlier entries</PaginationNextButton>
			</MainLayout>
		);
	}

};
