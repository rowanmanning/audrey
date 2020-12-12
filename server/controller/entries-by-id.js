'use strict';

const render = require('../middleware/render');
const requireAuth = require('../middleware/require-auth');

module.exports = function mountEntriesByIdController(app) {
	const {router} = app;
	const {Entry} = app.models;

	router.get('/entries/:entryId', [
		requireAuth(),
		fetchEntryById,
		autoMarkEntryAsRead,
		render('page/entries/view')
	]);

	router.post('/entries/:entryId/mark', [
		requireAuth(),
		fetchEntryById,
		handleMarkEntryForm,
		render('page/feeds/view')
	]);

	async function fetchEntryById(request, response, next) {
		try {
			request.entry = response.locals.entry = await Entry.findById(request.params.entryId);
			if (response.locals.entry) {
				return next();
			}
			next('route');
		} catch (error) {
			next(error);
		}
	}

	async function autoMarkEntryAsRead(request, response, next) {
		try {
			if (request.settings.autoMarkAsRead && request.query.nomark === undefined) {
				await request.entry.markAsRead();
			}
			next();
		} catch (error) {
			next(error);
		}
	}

	// Middleware to handle marking entries as read/unread/bookmarked
	async function handleMarkEntryForm(request, response, next) {

		// Add mark entry form details to the render context
		const markEntryForm = response.locals.markEntryForm = {
			action: request.entry.markUrl,
			errors: [],
			data: {
				setStatus: request.body.setStatus
			}
		};

		try {
			// On POST, attempt to mark the entry as read/unread/bookmarked
			if (request.method === 'POST') {
				if (markEntryForm.data.setStatus === 'read') {
					await request.entry.markAsRead();
				}
				if (markEntryForm.data.setStatus === 'unread') {
					await request.entry.markAsUnread();
				}
				if (markEntryForm.data.setStatus === 'bookmark') {
					await request.entry.markAsBookmarked();
				}
				if (markEntryForm.data.setStatus === 'unbookmark') {
					await request.entry.markAsUnbookmarked();
				}
				return response.redirect(`${request.entry.url}?nomark`);
			}
			next();
		} catch (error) {
			next(error);
		}
	}

};
