'use strict';

const demoError = require('../lib/demo-error');
const paginate = require('../middleware/paginate');
const render = require('../middleware/render');
const requireAuth = require('../middleware/require-auth');
const {ValidationError} = require('@rowanmanning/app');

module.exports = function mountFeedsByIdController(app) {
	const {router} = app;
	const {Entry, Feed} = app.models;

	router.get('/feeds/:feedId', [
		requireAuth(),
		fetchFeedById,
		paginate({
			perPage: 50,
			property: 'entryPagination',
			total: ({feed}) => Entry.countAllByFeedId(feed)
		}),
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
			response.locals.entries = await Entry
				.fetchAllByFeedId(response.locals.feed._id)
				.skip(request.entryPagination.currentPageStartIndex)
				.limit(request.entryPagination.perPage)
				.populate('feed');
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
						request.body.customTitle
				)
			}
		};

		try {
			// On POST, attempt to save the feed
			if (request.method === 'POST') {
				if (request.settings.demoMode) {
					throw demoError();
				}

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
				if (request.settings.demoMode) {
					throw demoError();
				}
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
			if (error instanceof ValidationError) {
				markFeedForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

};
