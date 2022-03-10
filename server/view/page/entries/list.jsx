'use strict';

const Breadcrumbs = require('../../component/breadcrumbs');
const EntryList = require('../../component/entry-list');
const {h, Component, Fragment} = require('preact');
const MainLayout = require('../../layout/main');
const Notification = require('../../component/notification');
const PaginationDescription = require('../../component/pagination/description');
const PaginationNextButton = require('../../component/pagination/next-button');

module.exports = class EntriesListPage extends Component {

	render(props) {
		const {breadcrumbs, entries, entryPagination, nextPage, settings} = props;

		props.pageTitle = 'All Entries';

		// Populate content sub-sections
		props.subSections = {

			// Content heading
			heading: (
				<Fragment>
					<Breadcrumbs items={breadcrumbs} />
					<div class="content-head">
						<h1 class="content-head__title">{props.pageTitle}</h1>
					</div>
				</Fragment>
			)
		};

		// Right-hand sidebar
		if (entries.length && settings.showHelpText) {
			props.subSections.rhs = (
				<Notification type="help">
					<p>
						This page displays all entries from all feeds, including those {' '}
						you have already read. {' '}
						<a href="/">You can view only <em>unread</em> entries here</a>.
					</p>
				</Notification>
			);
		}

		// Populate main content
		return (
			<MainLayout {...props}>
				<PaginationDescription date={entryPagination.before} resetUrl="/entries" />
				<EntryList items={entries}>
					<Notification type="help" testId="no-entries-message">
						<p>
							There are no entries here. This might be because you haven't {' '}
							<a href="/subscribe">subscribed</a> to any feeds yet. You may also have {' '}
							{settings.siteTitle} configured to not retain entries for very long; {' '}
							you can change the retention period on the {' '}
							<a href="/settings">settings page</a>.
						</p>
					</Notification>
				</EntryList>
				<PaginationNextButton url={nextPage}>View earlier entries</PaginationNextButton>
			</MainLayout>
		);
	}

};
