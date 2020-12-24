'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const request = require('../../helper/request');

describe('GET /feeds/:id/unsubscribe', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe(':id is a valid feed ID', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('GET', '/feeds/feed001/unsubscribe', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the feed unsubscribe page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Unsubscribe from Mock Feed 001 | Test Audrey'
				);
				assert.strictEqual(
					document.querySelector('h1').textContent,
					'Unsubscribe from Mock Feed 001'
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

			it('displays a feed "unsubscribe" form', async () => {
				assertHasUnsubscribeForm(response, await global.app.models.Feed.findById('feed001'));
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
			response = await request('GET', '/feeds/feed001/unsubscribe');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/feeds/feed001/unsubscribe');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/feeds/feed001/unsubscribe');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

describe('POST /feeds/:id/unsubscribe', () => {
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
				response = await request('POST', '/feeds/feed001/unsubscribe', {
					headers: {
						cookie: loginCookie
					},
					form: {
						confirm: 'true'
					}
				});
			});

			it('unsubscribes from the feed and deletes all entries', async () => {
				const feed = await global.app.models.Feed.findById('feed001');
				const entries = await global.app.models.Entry.fetchAllByFeedId('feed001');
				assert.isNull(feed);
				assert.lengthEquals(entries, 0);
			});

			it('redirects back to the feeds page', () => {
				assert.strictEqual(response.statusCode, 302);
				assert.strictEqual(response.headers.location, '/feeds');
			});

			describe('GET /feeds', () => {

				before(async () => {
					response = await request('GET', `/feeds`, {
						headers: {
							cookie: loginCookie
						}
					});
				});

				it('includes a notice that the feed has been unsubscribed from', () => {
					const {document} = response.dom();
					const messages = document.querySelectorAll('[data-test=unsubscribe-success]');
					assert.lengthEquals(messages, 1);
					assert.include(messages[0].textContent, 'Mock Feed 001');
				});

			});

		});

		describe('when an invalid `confirm` property is sent', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('POST', '/feeds/feed001/unsubscribe', {
					headers: {
						cookie: await getLoginCookie('password')
					},
					form: {
						confirm: ''
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
				assert.strictEqual(errors[0].textContent, 'Please confirm that you want to unsubscribe from this feed');
			});

			it('displays a feed "unsubscribe" form', async () => {
				assertHasUnsubscribeForm(response, await global.app.models.Feed.findById('feed001'));
			});

		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase([
				'settings',
				'feed-001'
			]);
			response = await request('POST', '/feeds/feed001/unsubscribe');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/feeds/feed001/unsubscribe');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('POST', '/feeds/feed001/unsubscribe');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

// Helper functions for these tests

function assertHasUnsubscribeForm(response, feed) {
	const {document} = response.dom();

	const form = document.querySelector(`form[action="/feeds/${feed._id}/unsubscribe"`);
	assert.isNotNull('form');
	assert.strictEqual(form.getAttribute('method'), 'post');

	const confirm = form.querySelector('input[name=confirm]');
	assert.isNotNull(confirm);
	assert.strictEqual(confirm.getAttribute('type'), 'checkbox');
	assert.strictEqual(confirm.getAttribute('value'), 'true');
	assert.isNull(confirm.getAttribute('checked'));

	const submitButton = form.querySelector('input[type=submit]');
	assert.isNotNull(submitButton);
}

