'use strict';

const {hashPassword} = require('../../lib/crypto/password');
const render = require('../../middleware/render');

module.exports = function mountAuthPasswordController(app) {
	const {router} = app;

	router.get('/auth/password', [
		handlePasswordGenerationForm,
		render('page/auth/password')
	]);

	router.post('/auth/password', [
		handlePasswordGenerationForm,
		render('page/auth/password')
	]);

	// Middleware to handle logging in
	async function handlePasswordGenerationForm(request, response, next) {

		// If the app already requires authentication, redirect home
		if (app.requiresAuth) {
			return response.redirect('/');
		}

		// Add password form details to the render context
		const passwordGenerationForm = response.locals.passwordGenerationForm = {
			action: request.url,
			errors: [],
			data: {
				password: request.body.password || ''
			}
		};

		try {
			// On POST, attempt to hash the password
			if (request.method === 'POST') {
				if (passwordGenerationForm.data.password.length >= 8) {
					response.locals.hashedPassword = await hashPassword(
						passwordGenerationForm.data.password
					);
				} else {
					passwordGenerationForm.errors.push(
						new Error('Password must be 8 or more characters in length')
					);
				}
			}
			next();
		} catch (error) {
			next(error);
		}
	}

};
