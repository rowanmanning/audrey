'use strict';

const render = require('../../middleware/render');
const requireAuth = require('../../middleware/require-auth');
const setQueryParam = require('../../lib/set-query-param');
const {ValidationError} = require('@rowanmanning/app');

module.exports = function mountFeedsViewController(app) {
	const {router} = app;
	const {Entry, Feed} = app.models;

	router.get('/feeds/:feedId', [
		requireAuth(),
		fetchFeedById,
		fetchFeedEntries,
		render('page/feeds/view')
	]);

	router.post('/feeds/:feedId/refresh', [
		requireAuth(),
		fetchFeedById,
		handleRefreshFeedForm,
		render('page/feeds/view')
	]);

	router.get('/feeds/:feedId/settings', [
		requireAuth(),
		fetchFeedById,
		handleFeedSettingsForm,
		render('page/feeds/settings')
	]);

	router.post('/feeds/:feedId/settings', [
		requireAuth(),
		fetchFeedById,
		handleFeedSettingsForm,
		render('page/feeds/settings')
	]);

	router.get('/feeds/:feedId/unsubscribe', [
		requireAuth(),
		fetchFeedById,
		handleUnsubscribeForm,
		render('page/feeds/unsubscribe')
	]);

	router.post('/feeds/:feedId/unsubscribe', [
		requireAuth(),
		fetchFeedById,
		handleUnsubscribeForm,
		render('page/feeds/unsubscribe')
	]);

	router.post('/feeds/:feedId/mark', [
		requireAuth(),
		fetchFeedById,
		handleMarkFeedForm,
		render('page/feeds/view')
	]);

	async function fetchFeedById(request, response, next) {
		try {
			request.feed = response.locals.feed = await Feed
				.findById(request.params.feedId)
				.populate('errors');
			if (response.locals.feed) {
				response.locals.feedIsRead = await response.locals.feed.isRead();
				return next();
			}
			next('route');
		} catch (error) {
			next(error);
		}
	}

	async function fetchFeedEntries(request, response, next) {
		try {
			const entryPagination = await Entry.fetchPaginated(request.query.before, 50, {
				feed: response.locals.feed._id
			});
			response.locals.entryPagination = entryPagination;
			response.locals.entries = entryPagination.items;
			response.locals.nextPage = (
				entryPagination.next ?
					setQueryParam(request.url, 'before', entryPagination.next) :
					null
			);
			next();
		} catch (error) {
			next(error);
		}
	}

	// Middleware to handle feed refreshing
	async function handleRefreshFeedForm(request, response, next) {
		try {
			await request.feed.refresh();
			request.flash('refreshed', true);
			return response.redirect(request.feed.url);
		} catch (error) {
			next(error);
		}
	}

	// Middleware to handle feed settings
	async function handleFeedSettingsForm(request, response, next) {

		// Add feed settings form details to the render context
		const feedSettingsForm = response.locals.feedSettingsForm = {
			action: request.feed.settingsUrl,
			errors: [],
			data: {
				customTitle: (
					request.body.customTitle === undefined ?
						request.feed.customTitle :
						request.body.customTitle.trim() || null
				)
			}
		};

		try {
			// On POST, attempt to save the feed
			if (request.method === 'POST') {

				// We use a fresh feed object so that we don't interfere
				// with displayed properties outside of the form
				const feed = await Feed.findById(request.feed._id);
				feed.customTitle = feedSettingsForm.data.customTitle;
				await feed.save();
				request.flash('saved', true);
				return response.redirect(feed.settingsUrl);
			}
			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				feedSettingsForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

	// Middleware to handle feed unsubscribe
	async function handleUnsubscribeForm(request, response, next) {

		// Add unsubscribe form details to the render context
		const unsubscribeForm = response.locals.unsubscribeForm = {
			action: request.feed.unsubscribeUrl,
			errors: [],
			data: {
				confirm: Boolean(request.body.confirm)
			}
		};

		try {
			// On POST, attempt to unsubscribe from the feed
			if (request.method === 'POST') {
				if (unsubscribeForm.data.confirm) {
					const title = request.feed.displayTitle;
					await request.feed.unsubscribe();
					request.flash('unsubscribed', title);
					return response.redirect('/feeds');
				}
				const error = new ValidationError();
				error.errors.confirm = new Error(
					'Please confirm that you want to unsubscribe from this feed'
				);
				throw error;
			}
			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				unsubscribeForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

	// Middleware to handle marking feeds as read/unread
	async function handleMarkFeedForm(request, response, next) {

		// Add mark feed form details to the render context
		const markFeedForm = response.locals.markFeedForm = {
			action: request.feed.markUrl,
			errors: [],
			data: {
				setStatus: request.body.setStatus
			}
		};

		try {
			// On POST, attempt to mark the feed as read/unread
			if (request.method === 'POST') {
				if (markFeedForm.data.setStatus === 'read') {
					await app.models.Entry.markAsReadByFeedId(request.feed._id);
				}
				if (markFeedForm.data.setStatus === 'unread') {
					await app.models.Entry.markAsUnreadByFeedId(request.feed._id);
				}
				return response.redirect(`${request.feed.url}`);
			}
			next();
		} catch (error) {
			next(error);
		}
	}

};
