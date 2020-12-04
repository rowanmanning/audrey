'use strict';

const render = require('../middleware/render');

module.exports = function mountLoginController(app) {
	const {router} = app;
	const {Settings} = app.models;

	router.get('/login', [
		handleLoginForm,
		render('page/auth/login')
	]);

	router.post('/login', [
		handleLoginForm,
		render('page/auth/login')
	]);

	// Middleware to handle logging in
	async function handleLoginForm(request, response, next) {

		// If the app doesn't have a password yet, redirect home
		if (!request.settings.hasPassword()) {
			return response.redirect('/');
		}

		// If a user is already logged in, redirect
		if (request.session.isAuthenticated) {
			return response.redirect(request.query.redirect || '/');
		}

		// Add login form details to the render context
		const loginForm = response.locals.loginForm = {
			action: request.url,
			errors: [],
			data: {
				password: request.body.password
			}
		};

		try {
			// On POST, attempt to log in
			if (request.method === 'POST') {
				if (await Settings.checkPassword(loginForm.data.password)) {
					request.session.isAuthenticated = true;
					return response.redirect(request.query.redirect || '/');
				}
				response.status(401);
				loginForm.errors.push(new Error('Credentials were incorrect'));
			}
			next();
		} catch (error) {
			next(error);
		}
	}

};
