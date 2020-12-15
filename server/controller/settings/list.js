'use strict';

const render = require('../../middleware/render');
const requireAuth = require('../../middleware/require-auth');
const {ValidationError} = require('@rowanmanning/app');

module.exports = function mountSettingsListController(app) {
	const {router} = app;
	const {Settings} = app.models;

	router.get('/settings', [
		requireAuth(),
		handleUpdateSettingsForm,
		render('page/settings/list')
	]);

	router.post('/settings', [
		requireAuth(),
		handleUpdateSettingsForm,
		render('page/settings/list')
	]);

	// Middleware to handle updating of site settings
	async function handleUpdateSettingsForm(request, response, next) {

		// Add settings form details to the render context
		const updateSettingsForm = response.locals.updateSettingsForm = {
			action: request.url,
			errors: [],
			data: {
				siteTitle: request.body.siteTitle || request.settings.siteTitle,
				removeOldEntries: (
					typeof request.body.removeOldEntries === 'undefined' ?
						request.settings.removeOldEntries :
						Boolean(request.body.removeOldEntries)
				),
				daysToRetainOldEntries: (
					typeof request.body.daysToRetainOldEntries === 'undefined' ?
						request.settings.daysToRetainOldEntries :
						parseInt(request.body.daysToRetainOldEntries, 10)
				),
				autoMarkAsRead: (
					typeof request.body.autoMarkAsRead === 'undefined' ?
						request.settings.autoMarkAsRead :
						Boolean(request.body.autoMarkAsRead)
				),
				showHelpText: (
					typeof request.body.showHelpText === 'undefined' ?
						request.settings.showHelpText :
						Boolean(request.body.showHelpText)
				)
			}
		};

		try {
			// On POST, attempt to save the settings
			if (request.method === 'POST') {

				// We use a fresh settings object so that we don't interfere
				// with displayed properties outside of the form
				const settings = await Settings.get();
				settings.siteTitle = updateSettingsForm.data.siteTitle;
				settings.removeOldEntries = updateSettingsForm.data.removeOldEntries;
				settings.daysToRetainOldEntries = updateSettingsForm.data.daysToRetainOldEntries;
				settings.autoMarkAsRead = updateSettingsForm.data.autoMarkAsRead;
				settings.showHelpText = updateSettingsForm.data.showHelpText;
				await settings.save();
				request.flash('saved', true);
				return response.redirect('/settings');
			}
			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				updateSettingsForm.errors = Object.values(error.errors);
				response.status(400);
				return next();
			}
			next(error);
		}
	}

};
