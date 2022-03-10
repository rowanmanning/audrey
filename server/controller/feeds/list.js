'use strict';

const render = require('@rowanmanning/response-render-middleware');
const requireAuth = require('../../middleware/require-auth');

module.exports = function mountFeedsListController(app) {
	const {Entry, Feed} = app.models;

	app.get('/feeds', [
		requireAuth(),
		listFeeds,
		fetchFeedRefreshStatus,
		render('page/feeds/list')
	]);

	app.get('/feeds/export/opml', [
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

	function renderOpml(request, response, next) {
		app.render('page/feeds/list-opml', response.locals, (error, output) => {
			if (error) {
				return next(error);
			}
			const fileName = `${request.settings.siteTitle} Feed Export.opml`;
			response.set({
				'Content-Description': 'File Transfer',
				'Content-Disposition': `attachment; filename=${fileName}`,
				'Content-Transfer-Encoding': 'binary',
				'Content-Type': 'application/octet-stream'
			});
			response.send(
				output.replace('<!DOCTYPE html>', '<?xml version="1.0" encoding="UTF-8"?>')
			);
		});
	}

};
