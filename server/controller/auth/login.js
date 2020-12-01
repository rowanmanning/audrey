'use strict';

const {comparePasswordToHash} = require('../../lib/crypto/password');
const render = require('../../middleware/render');

module.exports = function mountAuthLoginController(app) {
	const {router} = app;

	router.get('/auth/login', [
		handleLoginForm,
		render('page/auth/login')
	]);

	router.post('/auth/login', [
		handleLoginForm,
		render('page/auth/login')
	]);

	// Middleware to handle logging in
	async function handleLoginForm(request, response, next) {

		// If the app doesn't require authentication, just redirect them away
		if (!app.requiresAuth) {
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
				const isAuthenticated = await comparePasswordToHash(
					loginForm.data.password,
					app.options.passwordHash
				);
				if (isAuthenticated) {
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
