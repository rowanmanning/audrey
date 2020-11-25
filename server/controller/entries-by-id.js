'use strict';

const render = require('../middleware/render');
const {ValidationError} = require('@rowanmanning/app');

module.exports = function mountEntriesByIdController(app) {
	const {router} = app;
	const {Entry} = app.models;

	router.get('/entries/:entryId', [
		fetchEntryById,
		autoMarkEntryAsRead,
		render('page/entries/view')
	]);

	router.post('/entries/:entryId/mark', [
		fetchEntryById,
		handleMarkEntryForm,
		render('page/feeds/view')
	]);

	async function fetchEntryById(request, response, next) {
		try {
			request.entry = response.locals.entry = await Entry
				.findById(request.params.entryId)
				.populate('feed');
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

	// Middleware to handle feed refreshing
	async function handleMarkEntryForm(request, response, next) {

		// Add mark entry form details to the render context
		const markEntryForm = response.locals.markEntryForm = {
			action: request.entry.markUrl,
			errors: [],
			data: {
				setReadStatus: request.body.setReadStatus
			}
		};

		try {
			// On POST, attempt to mark the entry as read/unread
			if (request.method === 'POST') {
				if (markEntryForm.data.setReadStatus === 'read') {
					await request.entry.markAsRead();
					return response.redirect(request.entry.url);
				}
				await request.entry.markAsUnread();
				return response.redirect(`${request.entry.url}?nomark`);
			}
			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				markEntryForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

};
