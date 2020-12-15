'use strict';

const generateNetscapeBookmarks = require('netscape-bookmarks');
const render = require('../../middleware/render');
const requireAuth = require('../../middleware/require-auth');
const setQueryParam = require('../../lib/set-query-param');

module.exports = function mountBookmarksListController(app) {
	const {router} = app;
	const {Entry} = app.models;

	router.get('/bookmarks', [
		requireAuth(),
		listBookmarkedEntries,
		render('page/bookmarks/list')
	]);

	router.get('/bookmarks/export/html', [
		requireAuth(),
		renderNetscapeBookmarks
	]);

	async function listBookmarkedEntries(request, response, next) {
		try {
			const entryPagination = await Entry.fetchPaginated(request.query.before, 50, {
				isBookmarked: true
			});
			response.locals.entryPagination = entryPagination;
			response.locals.entries = entryPagination.items;
			response.locals.nextPage = (
				entryPagination.next ?
					setQueryParam(request.url, 'before', entryPagination.next) :
					null
			);
			response.locals.bookmarkCount = await Entry.countBookmarked();
			next();
		} catch (error) {
			next(error);
		}
	}

	async function renderNetscapeBookmarks(request, response, next) {
		try {
			const entries = await Entry.fetchBookmarked();
			const fileName = `${request.settings.siteTitle} Bookmarks Export.html`;
			response.set({
				'Content-Description': 'File Transfer',
				'Content-Disposition': `attachment; filename=${fileName}`,
				'Content-Transfer-Encoding': 'binary',
				'Content-Type': 'application/octet-stream'
			});
			response.send(generateNetscapeBookmarks(entries.reduce((bookmarks, entry) => {
				bookmarks[entry.displayTitle] = entry.htmlUrl;
				return bookmarks;
			}, {})));
		} catch (error) {
			next(error);
		}
	}

};
