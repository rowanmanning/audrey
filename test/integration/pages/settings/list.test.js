'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const request = require('../../helper/request');

describe('GET /settings', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		before(async () => {
			await seedDatabase([
				'settings'
			]);
			response = await request('GET', '/settings', {
				headers: {
					cookie: await getLoginCookie('password')
				}
			});
		});

		it('displays the settings page', () => {
			assert.strictEqual(response.statusCode, 200);
			assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

			const {document} = response.dom();
			assert.strictEqual(
				document.querySelector('title').textContent,
				'Settings | Test Audrey'
			);
			assert.strictEqual(
				document.querySelector('h1').textContent,
				'Settings'
			);
		});

		it('includes breadcrumbs for parent pages', () => {
			const {document} = response.dom();
			const breadcrumbs = document.querySelectorAll('[data-test=breadcrumb]');
			assert.lengthEquals(breadcrumbs, 1);
			assert.strictEqual(breadcrumbs[0].getAttribute('href'), '/');
			assert.strictEqual(breadcrumbs[0].textContent, 'Test Audrey');
		});

		it('includes a form to update site settings', async () => {
			assertHasSettingsForm(response, await global.app.models.Settings.get());
		});

		it('does not include a notice that settings have been saved', () => {
			const {document} = response.dom();
			const message = document.querySelector('[data-test=settings-saved]');
			assert.isNull(message);
		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/settings');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/settings');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/settings');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

describe('POST /settings', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe('when all valid settings are sent', () => {
			let loginCookie;

			before(async () => {
				await seedDatabase([
					'settings'
				]);
				loginCookie = await getLoginCookie('password');
				response = await request('POST', '/settings', {
					headers: {
						cookie: loginCookie
					},
					form: {
						siteTitle: 'Mock Site Title',
						removeOldEntries: '',
						daysToRetainOldEntries: '1',
						autoMarkAsRead: '',
						showHelpText: ''
					}
				});
			});

			it('saves the settings', async () => {
				const settings = await global.app.models.Settings.get();
				assert.strictEqual(settings.siteTitle, 'Mock Site Title');
				assert.isFalse(settings.removeOldEntries);
				assert.strictEqual(settings.daysToRetainOldEntries, 1);
				assert.isFalse(settings.autoMarkAsRead);
				assert.isFalse(settings.showHelpText);
			});

			it('redirects back to the settings page', () => {
				assert.strictEqual(response.statusCode, 302);
				assert.strictEqual(response.headers.location, '/settings');
			});

			describe('GET /settings', () => {

				before(async () => {
					response = await request('GET', `/settings`, {
						headers: {
							cookie: loginCookie
						}
					});
				});

				it('includes a notice that settings have been saved', () => {
					const {document} = response.dom();
					const messages = document.querySelectorAll('[data-test=settings-saved]');
					assert.lengthEquals(messages, 1);
				});

			});

		});

		describe('When an invalid `siteTitle` property is sent', () => {

			before(async () => {
				await seedDatabase([
					'settings'
				]);
				response = await request('POST', '/settings', {
					headers: {
						cookie: await getLoginCookie('password')
					},
					form: {
						siteTitle: 'a'
					}
				});
			});

			it('displays a 400 error page', () => {
				assert.strictEqual(response.statusCode, 400);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
			});

			it('includes an error message', () => {
				const {document} = response.dom();
				const errors = document.querySelectorAll('[data-test=form-error]');
				assert.lengthEquals(errors, 1);
				assert.strictEqual(errors[0].textContent, 'Site title setting must be between 3 and 20 characters in length');
			});

			it('includes a form to update site settings', async () => {
				const values = await global.app.models.Settings.get();
				values.siteTitle = 'a';
				assertHasSettingsForm(response, values);
			});

		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('POST', '/settings');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/settings');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('POST', '/settings');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

// Helper functions for these tests

function assertHasSettingsForm(response, settings) {
	const {document} = response.dom();

	const form = document.querySelector('form[action="/settings"');
	assert.isNotNull('form');
	assert.strictEqual(form.getAttribute('method'), 'post');

	const siteTitle = form.querySelector('input[name=siteTitle]');
	assert.isNotNull(siteTitle);
	assert.strictEqual(siteTitle.getAttribute('type'), 'text');
	assert.strictEqual(siteTitle.getAttribute('value'), settings.siteTitle);

	const removeOldEntries = form.querySelectorAll('input[name=removeOldEntries]');
	assert.lengthEquals(removeOldEntries, 2);
	assert.strictEqual(removeOldEntries[0].getAttribute('type'), 'radio');
	assert.strictEqual(removeOldEntries[0].getAttribute('value'), 'true');
	assert.strictEqual(removeOldEntries[1].getAttribute('type'), 'radio');
	assert.strictEqual(removeOldEntries[1].getAttribute('value'), '');

	const daysToRetainOldEntries = form.querySelector('input[name=daysToRetainOldEntries]');
	assert.isNotNull(daysToRetainOldEntries);
	assert.strictEqual(daysToRetainOldEntries.getAttribute('type'), 'number');
	assert.strictEqual(daysToRetainOldEntries.getAttribute('value'), `${settings.daysToRetainOldEntries}`);
	assert.strictEqual(daysToRetainOldEntries.getAttribute('min'), '1');

	const schedule = form.querySelector('input[name=schedule]');
	assert.isNotNull(schedule);
	assert.strictEqual(schedule.getAttribute('type'), 'text');
	assert.strictEqual(schedule.getAttribute('disabled'), '');

	const autoMarkAsRead = form.querySelectorAll('input[name=autoMarkAsRead]');
	assert.lengthEquals(autoMarkAsRead, 2);
	assert.strictEqual(autoMarkAsRead[0].getAttribute('type'), 'radio');
	assert.strictEqual(autoMarkAsRead[0].getAttribute('value'), 'true');
	assert.strictEqual(autoMarkAsRead[1].getAttribute('type'), 'radio');
	assert.strictEqual(autoMarkAsRead[1].getAttribute('value'), '');

	const showHelpText = form.querySelectorAll('input[name=showHelpText]');
	assert.lengthEquals(showHelpText, 2);
	assert.strictEqual(showHelpText[0].getAttribute('type'), 'radio');
	assert.strictEqual(showHelpText[0].getAttribute('value'), 'true');
	assert.strictEqual(showHelpText[1].getAttribute('type'), 'radio');
	assert.strictEqual(showHelpText[1].getAttribute('value'), '');

	const submitButton = form.querySelector('input[type=submit]');
	assert.isNotNull(submitButton);
}
