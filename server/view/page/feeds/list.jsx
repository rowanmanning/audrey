'use strict';

const Breadcrumbs = require('../../component/breadcrumbs');
const FeedList = require('../../component/feed-list');
const {h, Component, Fragment} = require('preact');
const MainLayout = require('../../layout/main');
const Notification = require('../../component/notification');

module.exports = class FeedsListPage extends Component {

	render(props) {
		const {breadcrumbs, feeds, feedEntryCounts, isRefreshInProgress, request, settings} = props;

		props.pageTitle = 'Feeds';

		const totalCounts = Object.values(feedEntryCounts).reduce((result, counts) => {
			return {
				read: (result.read || 0) + counts.read,
				total: (result.total || 0) + counts.total,
				unread: (result.unread || 0) + counts.unread
			};
		}, {});

		// Displat the feed refresh in progress message
		function displayRefreshInProgress() {
			return (
				<Notification type="warning" testId="feeds-refreshing-message">
					<p>
						Feeds are currently being refreshed. Reload this page in a minute or two
					</p>
				</Notification>
			);
		}

		// Show feeds help text
		function showHelpText() {
			if (settings.showHelpText) {
				return (
					<Notification type="help">
						<p>
							This page shows all of the feeds you're subscribed to. You can
							click a feed to view all entries from it and manage subscriptions.
						</p>
					</Notification>
				);
			}
			return '';
		}

		// Show an unsubscribe success message
		function showUnsubscribeSuccess() {
			const flashMessage = request.flash('unsubscribed');
			if (flashMessage && flashMessage.length) {
				return (
					<Notification type="success" testId="unsubscribe-success">
						<p>
							You have successfully unsubscribed from "{flashMessage.pop()}".
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
						<h1 class="content-head__title">{props.pageTitle}</h1>
						<nav class="content-head__navigation">
							<ul>
								<li>
									<a
										href="/subscribe"
										class="content-head__link content-head__link--subscribe"
										title="Subscribe to a feed"
									>Subscribe</a>
								</li>
								<li>
									<form method="post" action="/feeds/refresh">
										<input
											type="submit"
											value="Refresh"
											disabled={isRefreshInProgress}
											class="content-head__link content-head__link--refresh"
											title="Refresh all feeds"
										/>
									</form>
								</li>
							</ul>
						</nav>
					</div>
				</Fragment>
			),

			// Right-hand sidebar
			rhs: (feeds.length ? (
				<Fragment>
					{showHelpText()}
					<div class="notification notification--info">
						<p>
							You are subscribed to {feeds.length} feeds.
							You've read {totalCounts.read} out of {totalCounts.total} entries.
						</p>
					</div>
					<nav class="nav-list">
						<ul>
							<li>
								<a class="nav-list__link" href="/feeds/export/opml">
									Export feeds as OPML
								</a>
							</li>
						</ul>
					</nav>
				</Fragment>
			) : '')
		};

		// Populate main content
		return (
			<MainLayout {...props}>
				{showUnsubscribeSuccess()}
				{isRefreshInProgress ? displayRefreshInProgress() : ''}
				<FeedList items={feeds} feedEntryCounts={feedEntryCounts}>
					<Notification type="help" testId="no-feeds-message">
						<p>
							You haven't subscribed to any feeds yet, once you do they'll appear
							here. You can <a href="/subscribe">subscribe to a feed here</a>, or
							there's a useful shortcut button in the header above ↑ (look for the
							orange plus icon).
						</p>
					</Notification>
				</FeedList>
			</MainLayout>
		);
	}

};
