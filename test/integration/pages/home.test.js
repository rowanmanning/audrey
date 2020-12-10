'use strict';

const assert = require('proclaim');
const bcrypt = require('bcrypt');
const getLoginCookie = require('../helper/get-login-cookie');
const seedDatabase = require('../helper/seed-database');
const request = require('../helper/request');

describe('GET /', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe('feeds are present and unread entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('GET', '/', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the home page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Test Audrey'
				);
			});

			it('lists all unread entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthEquals(entries, 2);

				assert.strictEqual(
					entries[0].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 001 - Entry 2'
				);
				assert.isNotNull(entries[0].querySelector('a[href="/entries/feed001-entry2"]'));
				assert.isNotNull(entries[0].querySelector('a[href="/feeds/feed001"]'));

				assert.strictEqual(
					entries[1].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 001 - Entry 1'
				);
				assert.isNotNull(entries[1].querySelector('a[href="/entries/feed001-entry1"]'));
				assert.isNotNull(entries[1].querySelector('a[href="/feeds/feed001"]'));
			});

			it('does not include pagination', () => {
				const {document} = response.dom();
				const pagination = document.querySelector('[data-test=pagination]');
				assert.isNull(pagination);
			});

			it('does not include a notice that all entries have been read', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=no-entries-message]');
				assert.isNull(message);
			});

			it('does not include a welcome message', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=welcome-message]');
				assert.isNull(message);
			});

		});

		describe('feeds are present and more than 50 entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-002'
				]);
				response = await request('GET', '/', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('lists the latest 50 unread entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthEquals(entries, 50);

				assert.strictEqual(
					entries[0].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 100'
				);
				assert.strictEqual(
					entries[1].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 99'
				);
				assert.strictEqual(
					entries[49].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 51'
				);
			});

			it('includes pagination', () => {
				const {document} = response.dom();
				const next = document.querySelectorAll('[data-test=pagination-next]');
				assert.lengthEquals(next, 1);

				// 51 days from January first
				assert.strictEqual(next[0].getAttribute('href'), '/?before=2020-02-21T00%3A00%3A00.000Z');
			});

		});

		describe('feeds are present but no unread entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001',
					'mark-all-entries-as-read'
				]);
				response = await request('GET', '/', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the home page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Test Audrey'
				);
			});

			it('includes a notice that all entries have been read', () => {
				const {document} = response.dom();
				const messages = document.querySelectorAll('[data-test=no-entries-message]');
				assert.lengthEquals(messages, 1);
			});

			it('lists no entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthEquals(entries, 0);
			});

			it('does not include a welcome message', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=welcome-message]');
				assert.isNull(message);
			});

		});

		describe('no feeds are present', () => {

			before(async () => {
				await seedDatabase(['settings']);
				response = await request('GET', '/', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the home page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Test Audrey'
				);
			});

			it('includes a welcome message with a link to subscribe', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=welcome-message]');
				assert.isNotNull(message);
				assert.isNotNull(message.querySelector('a[href="/subscribe"]'));
			});

			it('lists no entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthEquals(entries, 0);
			});

			it('does not include a notice that all entries have been read', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=no-entries-message]');
				assert.isNull(message);
			});

		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/');
		});

		it('displays the set password page', () => {
			assert.strictEqual(response.statusCode, 200);
			assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

			const {document} = response.dom();
			assert.strictEqual(
				document.querySelector('title').textContent,
				'Set a Password | Audrey'
			);
		});

		it('includes a form to set the site password', () => {
			assertHasSetPasswordForm(response);
		});

	});

});

// 51 days from January first
describe('GET /?before=2020-02-21T00%3A00%3A00.000Z', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe('feeds are present and more than 50 entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-002'
				]);
				response = await request('GET', '/?before=2020-02-21T00%3A00%3A00.000Z', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('lists the second page of unread entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthEquals(entries, 50);

				assert.strictEqual(
					entries[0].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 50'
				);
				assert.strictEqual(
					entries[1].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 49'
				);
				assert.strictEqual(
					entries[49].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 1'
				);
			});

			it('does not include pagination', () => {
				const {document} = response.dom();
				const pagination = document.querySelector('[data-test=pagination]');
				assert.isNull(pagination);
			});

		});

	});

});

describe('POST /', () => {
	let response;

	describe('when app is not configured', () => {

		describe('when a valid `password` property is sent', () => {

			before(async () => {
				await seedDatabase([]);
				response = await request('POST', '/', {
					form: {
						password: 'password'
					}
				});
			});

			it('hashes the password with bcrypt and stores it in the site settings', async () => {
				const {passwordHash} = await global.app.models.Settings.get();
				assert.isTrue(await bcrypt.compare('password', passwordHash));
			});

			it('redirects to the home page', () => {
				assert.strictEqual(response.statusCode, 302);
				assert.strictEqual(response.headers.location, '/');
			});

		});

		describe('when no `password` property is sent', () => {

			before(async () => {
				await seedDatabase([]);
				response = await request('POST', '/');
			});

			it('does not store a password in the site settings', async () => {
				const {passwordHash} = await global.app.models.Settings.get();
				assert.isUndefined(passwordHash);
			});

			it('displays a 400 error page', () => {
				assert.strictEqual(response.statusCode, 400);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
			});

			it('includes a password error message', () => {
				const {document} = response.dom();
				const errors = document.querySelectorAll('[data-test=form-error]');
				assert.lengthEquals(errors, 1);
				assert.strictEqual(errors[0].textContent, 'Password must be 8 or more characters in length');
			});

			it('includes a form to set the site password', () => {
				assertHasSetPasswordForm(response);
			});

		});

		describe('when an invalid `password` property is sent', () => {

			before(async () => {
				await seedDatabase([]);
				response = await request('POST', '/', {
					form: {
						password: 'abc'
					}
				});
			});

			it('does not store a password in the site settings', async () => {
				const {passwordHash} = await global.app.models.Settings.get();
				assert.isUndefined(passwordHash);
			});

			it('displays a 400 error page', () => {
				assert.strictEqual(response.statusCode, 400);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
			});

			it('includes a password error message', () => {
				const {document} = response.dom();
				const errors = document.querySelectorAll('[data-test=form-error]');
				assert.lengthEquals(errors, 1);
				assert.strictEqual(errors[0].textContent, 'Password must be 8 or more characters in length');
			});

			it('includes a form to set the site password', () => {
				assertHasSetPasswordForm(response);
			});

		});

	});

	describe('when the app is configured', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('POST', '/');
		});

		it('displays a 404 error page', () => {
			assert.strictEqual(response.statusCode, 404);
			assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
		});

	});

});

// Helper functions for these tests

function assertHasSetPasswordForm(response) {
	const {document} = response.dom();

	const form = document.querySelector('form');
	assert.isNotNull('form');
	assert.strictEqual(form.getAttribute('method'), 'post');
	assert.strictEqual(form.getAttribute('action'), '/');

	const passwordInput = form.querySelector('input[name=password]');
	assert.isNotNull(passwordInput);
	assert.strictEqual(passwordInput.getAttribute('type'), 'password');

	const submitButton = form.querySelector('input[type=submit]');
	assert.isNotNull(submitButton);
}
