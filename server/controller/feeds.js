'use strict';

const render = require('../middleware/render');
const requireAuth = require('../middleware/require-auth');

module.exports = function mountFeedsController(app) {
	const {router} = app;
	const {Entry, Feed} = app.models;

	router.get('/feeds', [
		requireAuth(),
		listFeeds,
		fetchFeedRefreshStatus,
		render('page/feeds/list')
	]);

	router.get('/feeds.opml', [
		requireAuth(),
		listFeeds,
		renderOpml
	]);

	async function listFeeds(request, response, next) {
		try {
			response.locals.feeds = await Feed.fetchAll().populate('errors');
			response.locals.feedEntryCounts = await Entry.countGroupedByFeedId();
			next();
		} catch (error) {
			next(error);
		}
	}

	function fetchFeedRefreshStatus(request, response, next) {
		response.locals.isRefreshInProgress = Feed.isRefreshInProgress();
		next();
	}

	function renderOpml(request, response) {
		const fileName = `${request.settings.siteTitle} Feed Export.opml`;
		response.set({
			'Content-Description': 'File Transfer',
			'Content-Disposition': `attachment; filename=${fileName}`,
			'Content-Transfer-Encoding': 'binary',
			'Content-Type': 'application/octet-stream'
		});
		return response.render('page/feeds/list-opml', {
			doctype: '<?xml version="1.0" encoding="UTF-8"?>'
		});
	}

};
