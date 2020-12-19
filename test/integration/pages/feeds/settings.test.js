'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const request = require('../../helper/request');

describe('GET /feeds/:id/settings', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe(':id is a valid feed ID', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('GET', '/feeds/feed001/settings', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the feed settings page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Settings for Mock Feed 001 | Test Audrey'
				);
				assert.strictEqual(
					document.querySelector('h1').textContent,
					'Settings for Mock Feed 001'
				);
			});

			it('includes breadcrumbs for parent pages', () => {
				const {document} = response.dom();
				const breadcrumbs = document.querySelectorAll('[data-test=breadcrumb]');
				assert.lengthEquals(breadcrumbs, 3);
				assert.strictEqual(breadcrumbs[0].getAttribute('href'), '/');
				assert.strictEqual(breadcrumbs[0].textContent, 'Test Audrey');
				assert.strictEqual(breadcrumbs[1].getAttribute('href'), '/feeds');
				assert.strictEqual(breadcrumbs[1].textContent, 'Feeds');
				assert.strictEqual(breadcrumbs[2].getAttribute('href'), '/feeds/feed001');
				assert.strictEqual(breadcrumbs[2].textContent, 'Mock Feed 001');
			});

			it('displays a feed "settings" form', async () => {
				assertHasSettingsForm(response, await global.app.models.Feed.findById('feed001'));
			});

			it('does not include a notice that feed settings have been saved', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=settings-saved]');
				assert.isNull(message);
			});

			it('includes an unsubscribe button', () => {
				const {document} = response.dom();
				const form = document.querySelector('form[action="/feeds/feed001/unsubscribe"]');
				assert.isNotNull(form);
				assert.strictEqual(form.getAttribute('method'), 'get');
				assert.isNotNull(form.querySelector('input[type=submit]'));
			});

		});

		describe(':id is an invalid feed ID', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('GET', '/feeds/notafeed', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays a 404 page', () => {
				assert.strictEqual(response.statusCode, 404);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
			});

		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/feeds/feed001/settings');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/feeds/feed001/settings');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/feeds/feed001/settings');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

describe('POST /feeds/:id/settings', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe('when all valid settings are sent', () => {
			let loginCookie;

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				loginCookie = await getLoginCookie('password');
				response = await request('POST', '/feeds/feed001/settings', {
					headers: {
						cookie: loginCookie
					},
					form: {
						customTitle: 'Mock Custom Title'
					}
				});
			});

			it('saves the feed settings', async () => {
				const feed = await global.app.models.Feed.findById('feed001');
				assert.strictEqual(feed.customTitle, 'Mock Custom Title');
			});

			it('redirects back to the feed settings page', () => {
				assert.strictEqual(response.statusCode, 302);
				assert.strictEqual(response.headers.location, '/feeds/feed001/settings');
			});

			describe('GET /feeds/feed001/settings', () => {

				before(async () => {
					response = await request('GET', `/feeds/feed001/settings`, {
						headers: {
							cookie: loginCookie
						}
					});
				});

				it('includes a notice that feed settings have been saved', () => {
					const {document} = response.dom();
					const messages = document.querySelectorAll('[data-test=settings-saved]');
					assert.lengthEquals(messages, 1);
				});

			});

		});

		describe('when an invalid `customTitle` property is sent', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('POST', '/feeds/feed001/settings', {
					headers: {
						cookie: await getLoginCookie('password')
					},
					form: {
						customTitle: 'a'
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
				assert.strictEqual(errors[0].textContent, 'Feed custom title must be between 3 and 20 characters in length');
			});

			it('displays a feed "settings" form', async () => {
				const feed = await global.app.models.Feed.findById('feed001');
				feed.customTitle = 'a';
				assertHasSettingsForm(response, feed);
			});

		});

		describe('when the `customTitle` property is empty', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				await global.app.models.Feed.updateOne({_id: 'feed001'}, {
					$set: {
						customTitle: 'Mock Custom Title'
					}
				});
				response = await request('POST', '/feeds/feed001/settings', {
					headers: {
						cookie: await getLoginCookie('password')
					},
					form: {
						customTitle: ''
					}
				});
			});

			it('saves the feed settings custom title as `null`', async () => {
				const feed = await global.app.models.Feed.findById('feed001');
				assert.isNull(feed.customTitle);
			});

			it('redirects back to the feed settings page', () => {
				assert.strictEqual(response.statusCode, 302);
				assert.strictEqual(response.headers.location, '/feeds/feed001/settings');
			});

		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase([
				'settings',
				'feed-001'
			]);
			response = await request('POST', '/feeds/feed001/settings');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/feeds/feed001/settings');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('POST', '/feeds/feed001/settings');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

// Helper functions for these tests

function assertHasSettingsForm(response, feed) {
	const {document} = response.dom();

	const form = document.querySelector(`form[action="/feeds/${feed._id}/settings"`);
	assert.isNotNull('form');
	assert.strictEqual(form.getAttribute('method'), 'post');

	const customTitle = form.querySelector('input[name=customTitle]');
	assert.isNotNull(customTitle);
	assert.strictEqual(customTitle.getAttribute('type'), 'text');
	assert.strictEqual(customTitle.getAttribute('value'), feed.customTitle);

	const submitButton = form.querySelector('input[type=submit]');
	assert.isNotNull(submitButton);
}

