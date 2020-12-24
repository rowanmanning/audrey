'use strict';

const EntryList = require('../component/entry-list');
const {h, Component} = require('@rowanmanning/app/preact');
const MainLayout = require('../layout/main');
const Notification = require('../component/notification');
const PaginationDescription = require('../component/pagination/description');
const PaginationNextButton = require('../component/pagination/next-button');

module.exports = class HomePage extends Component {

	render(props) {
		const {entries, entryPagination, nextPage, settings, totalFeedCount} = props;

		// Render a welcome message
		function renderWelcome() {
			return (
				<Notification type="help" testId="welcome-message">
					<p><strong>Welcome to {settings.siteTitle}!</strong></p>
					<p>
						To get started, the first thing you'll need to do is {' '}
						<a href="/subscribe">subscribe to a feed</a>. There's a useful {' '}
						shortcut button in the header above ↑ (look for the orange plus icon).
					</p>
					<p>
						You can also visit the <a href="/settings">settings page</a> {' '}
						to configure {settings.siteTitle} just the way you like it. See the {' '}
						green cog icon in the header.
					</p>
				</Notification>
			);
		}

		// Render a "nothing to read" message
		function renderNothingToRead() {
			return (
				<div class="content-body" data-test="no-entries-message">
					<h2>You read everything</h2>
					<p>
						There's nothing new to read at the moment, you read it all! If you're
						looking for more content, try {' '}
						<a href="/subscribe">subscribing to more feeds</a>.
					</p>
				</div>
			);
		}

		// Populate content sub-sections
		props.subSections = {

			// Content heading
			hideHeading: true,
			heading: (
				<div class="content-head">
					<h1 class="content-head__title">{settings.siteTitle}</h1>
				</div>
			)
		};

		// Right-hand sidebar
		if (totalFeedCount && settings.showHelpText) {
			props.subSections.rhs = (
				<Notification type="help">
					<p>
						This is the main page, showing entries from all feeds that you have not {' '}
						yet read. <a href="/entries">You can find <em>all</em> entries here</a>.
					</p>
				</Notification>
			);
		}

		// Populate main content
		return (
			<MainLayout {...props}>
				<PaginationDescription date={entryPagination.before} resetUrl="/" />
				<EntryList items={entries}>
					{totalFeedCount ? renderNothingToRead() : renderWelcome()}
				</EntryList>
				<PaginationNextButton url={nextPage}>View earlier entries</PaginationNextButton>
			</MainLayout>
		);
	}

};
