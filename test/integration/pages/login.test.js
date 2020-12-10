'use strict';

const assert = require('proclaim');
const getLatestSession = require('../helper/get-latest-session');
const getLoginCookie = require('../helper/get-login-cookie');
const seedDatabase = require('../helper/seed-database');
const request = require('../helper/request');

describe('GET /login', () => {
	let response;

	describe('when app is configured and not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/login');
		});

		it('displays the login page', () => {
			assert.strictEqual(response.statusCode, 200);
			assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

			const {document} = response.dom();
			assert.strictEqual(
				document.querySelector('title').textContent,
				'Sign in | Test Audrey'
			);
			assert.strictEqual(
				document.querySelector('h1').textContent,
				'Sign in'
			);
		});

		it('includes breadcrumbs for parent pages', () => {
			const {document} = response.dom();
			const breadcrumbs = document.querySelectorAll('[data-test=breadcrumb]');
			assert.lengthEquals(breadcrumbs, 1);
			assert.strictEqual(breadcrumbs[0].getAttribute('href'), '/');
			assert.strictEqual(breadcrumbs[0].textContent, 'Test Audrey');
		});

		it('includes a form to log in', () => {
			assertHasLoginForm(response);
		});

	});

	describe('when the app is configured and already logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/login', {
				headers: {
					cookie: await getLoginCookie('password')
				}
			});
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/login');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

describe('POST /login', () => {
	let response;

	describe('when app is configured and not logged in', () => {

		describe('when a valid `password` property is sent', () => {

			before(async () => {
				await seedDatabase(['settings']);
				response = await request('POST', '/login', {
					form: {
						password: 'password'
					}
				});
			});

			it('logs the user in', async () => {
				const session = await getLatestSession();
				assert.isObject(session);
				assert.isTrue(session.session.isAuthenticated);
				assert.isArray(response.headers['set-cookie']);
				assert.match(response.headers['set-cookie'][0], /^Audrey Session=/);
			});

			it('redirects to the home page', () => {
				assert.strictEqual(response.statusCode, 302);
				assert.strictEqual(response.headers.location, '/');
			});

		});

		describe('when an invalid `password` property is sent', () => {

			before(async () => {
				await seedDatabase(['settings']);
				response = await request('POST', '/login', {
					form: {
						password: 'abc'
					}
				});
			});

			it('displays a 401 error page', () => {
				assert.strictEqual(response.statusCode, 401);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
			});

			it('includes an error message', () => {
				const {document} = response.dom();
				const errors = document.querySelectorAll('[data-test=form-error]');
				assert.lengthEquals(errors, 1);
				assert.strictEqual(errors[0].textContent, 'Credentials were incorrect');
			});

			it('includes a form to log in', () => {
				assertHasLoginForm(response);
			});

		});

		describe('when an incorrect `password` property is sent', () => {

			before(async () => {
				await seedDatabase(['settings']);
				response = await request('POST', '/login', {
					form: {
						password: 'thisisnotmypassword'
					}
				});
			});

			it('displays a 401 error page', () => {
				assert.strictEqual(response.statusCode, 401);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
			});

			it('includes an error message', () => {
				const {document} = response.dom();
				const errors = document.querySelectorAll('[data-test=form-error]');
				assert.lengthEquals(errors, 1);
				assert.strictEqual(errors[0].textContent, 'Credentials were incorrect');
			});

			it('includes a form to log in', () => {
				assertHasLoginForm(response);
			});

		});

	});

	describe('when the app is configured and already logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('POST', '/login', {
				headers: {
					cookie: await getLoginCookie('password')
				}
			});
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

	describe('when the app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('POST', '/login');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

describe('POST /login?redirect=/example', () => {
	let response;

	describe('when app is configured and not logged in', () => {

		describe('when a valid `password` property is sent', () => {

			before(async () => {
				await seedDatabase(['settings']);
				response = await request('POST', '/login?redirect=/example', {
					form: {
						password: 'password'
					}
				});
			});

			it('redirects to the specified redirect page', () => {
				assert.strictEqual(response.statusCode, 302);
				assert.strictEqual(response.headers.location, '/example');
			});

		});

	});

});

// Helper functions for these tests

function assertHasLoginForm(response) {
	const {document} = response.dom();

	const form = document.querySelector('form');
	assert.isNotNull('form');
	assert.strictEqual(form.getAttribute('method'), 'post');
	assert.strictEqual(form.getAttribute('action'), '/login');

	const passwordInput = form.querySelector('input[name=password]');
	assert.isNotNull(passwordInput);
	assert.strictEqual(passwordInput.getAttribute('type'), 'password');

	const submitButton = form.querySelector('input[type=submit]');
	assert.isNotNull(submitButton);
}
