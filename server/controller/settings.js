'use strict';

const render = require('../middleware/render');
const {ValidationError} = require('@rowanmanning/app');

module.exports = function mountSettingsController(app) {
	const {router} = app;
	const {Settings} = app.models;

	router.get('/settings', [
		listSettings,
		handleUpdateSettingsForm,
		render('page/settings/list')
	]);

	router.post('/settings', [
		listSettings,
		handleUpdateSettingsForm,
		render('page/settings/list')
	]);

	async function listSettings(request, response, next) {
		try {
			request.settings = response.locals.settings = await Settings.get();
			next();
		} catch (error) {
			next(error);
		}
	}

	// Middleware to handle updating of site settings
	async function handleUpdateSettingsForm(request, response, next) {

		// Add settings form details to the render context
		const updateSettingsForm = response.locals.updateSettingsForm = {
			action: request.url,
			errors: [],
			data: {
				removeOldPosts: (
					typeof request.body.removeOldPosts === 'undefined' ?
						request.settings.removeOldPosts :
						Boolean(request.body.removeOldPosts)
				),
				daysToRetainOldPosts: (
					typeof request.body.daysToRetainOldPosts === 'undefined' ?
						request.settings.daysToRetainOldPosts :
						parseInt(request.body.daysToRetainOldPosts, 10)
				)
			}
		};

		try {
			// On POST, attempt to save the settings
			if (request.method === 'POST') {
				const settings = await Settings.get();
				settings.removeOldPosts = updateSettingsForm.data.removeOldPosts;
				settings.daysToRetainOldPosts = updateSettingsForm.data.daysToRetainOldPosts;
				await settings.save();
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
