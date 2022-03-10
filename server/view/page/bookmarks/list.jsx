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
		const {breadcrumbs, bookmarkCount, entries, entryPagination, nextPage, settings} = props;

		props.pageTitle = 'Bookmarked Entries';

		// Show bookmarks help text
		function showHelpText() {
			if (settings.showHelpText) {
				return (
					<Notification type="help">
						<p>
							This page displays all entries that you have bookmarked. Bookmarking
							an entry means that it will never be deleted from {settings.siteTitle}.
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
					</div>
				</Fragment>
			),

			// Right-hand sidebar
			rhs: (entries.length ? (
				<Fragment>
					{showHelpText()}
					<div class="notification notification--info">
						<p>
							You have bookmarked {bookmarkCount} entries.
						</p>
					</div>
					<nav class="nav-list">
						<ul>
							<li>
								<a class="nav-list__link" href="/bookmarks/export/html">
									Export as HTML
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
				<PaginationDescription date={entryPagination.before} resetUrl="/bookmarks" />
				<EntryList items={entries}>
					<Notification type="help" testId="no-bookmarks-message">
						<p>
							You haven't bookmarked any entries yet. Bookmarking an entry
							means it will never be deleted from {settings.siteTitle}, so
							you can come back at any time and read it. You can find a
							bookmark button at the top of each entry you read.
						</p>
					</Notification>
				</EntryList>
				<PaginationNextButton url={nextPage}>View earlier bookmarks</PaginationNextButton>
			</MainLayout>
		);
	}

};
