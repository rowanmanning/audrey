'use strict';

const {assert} = require('chai');
const getLoginCookie = require('../helper/get-login-cookie');
const seedDatabase = require('../helper/seed-database');
const request = require('../helper/request');

describe('GET /subscribe', () => {
	let response;

	describe('when app is configured and logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/subscribe', {
				headers: {
					cookie: await getLoginCookie('password')
				}
			});
		});

		it('displays the subscribe page', () => {
			assert.strictEqual(response.statusCode, 200);
			assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

			const {document} = response.dom();
			assert.strictEqual(
				document.querySelector('title').textContent,
				'Subscribe to a feed | Test Audrey'
			);
			assert.strictEqual(
				document.querySelector('h1').textContent,
				'Subscribe to a feed'
			);
		});

		it('includes breadcrumbs for parent pages', () => {
			const {document} = response.dom();
			const breadcrumbs = document.querySelectorAll('[data-test=breadcrumb]');
			assert.lengthOf(breadcrumbs, 1);
			assert.strictEqual(breadcrumbs[0].getAttribute('href'), '/');
			assert.strictEqual(breadcrumbs[0].textContent, 'Test Audrey');
		});

		it('includes a form to subscribe to a feed', () => {
			assertHasSubscribeForm(response);
		});

	});

	describe('when the app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/subscribe');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/subscribe');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/subscribe');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

describe('POST /subscribe', () => {
	let response;

	describe('when app is configured and logged in', () => {

		describe('when a valid `xmlUrl` property is sent', () => {
			let feed;
			let loginCookie;

			before(async () => {
				await seedDatabase(['settings']);
				loginCookie = await getLoginCookie('password');
				response = await request('POST', '/subscribe', {
					headers: {
						cookie: loginCookie
					},
					form: {
						xmlUrl: 'http://mock-feeds.com/valid/001/feed.xml'
					}
				});
				feed = await global.app.models.Feed.findOne({xmlUrl: 'http://mock-feeds.com/valid/001/feed.xml'});
			});

			it('subscribes to the feed, adding a feed and all entries', async () => {
				assert.isObject(feed);
				assert.strictEqual(feed.title, 'Mock Feed 001');
				assert.strictEqual(feed.htmlUrl, 'http://mock-feeds.com/valid/001/');

				const entries = await global.app.models.Entry.find({feed: feed._id});
				assert.lengthOf(entries, 4);

				const entry1 = entries.find(entry => entry.title === 'Mock Feed 001 - Entry 1');
				assert.strictEqual(entry1.htmlUrl, 'http://mock-feeds.com/valid/001/entry-1');
				assert.strictEqual(entry1.guid, 'http://mock-feeds.com/valid/001/entry-id-1');
				assert.strictEqual(entry1.content, '<p>Entry 1 Content</p>');

				const entry2 = entries.find(entry => entry.title === 'Mock Feed 001 - Entry 2');
				assert.strictEqual(entry2.htmlUrl, 'http://mock-feeds.com/valid/001/entry-2');
				assert.strictEqual(entry2.guid, 'http://mock-feeds.com/valid/001/entry-id-2');
				assert.strictEqual(entry2.content, '<p>Entry 2 Content</p>');

				const entry3 = entries.find(entry => entry.title === 'Mock Feed 001 - Entry 3');
				assert.strictEqual(entry3.title, 'Mock Feed 001 - Entry 3');
				assert.strictEqual(entry3.htmlUrl, 'http://mock-feeds.com/valid/001/entry-3');
				assert.strictEqual(entry3.guid, 'http://mock-feeds.com/valid/001/entry-id-3');
				assert.strictEqual(entry3.content, '<p>Entry 3 Content</p>');

				const entry4 = entries.find(entry => entry.title === 'Mock Feed 001 - Entry 4');
				assert.strictEqual(entry4.title, 'Mock Feed 001 - Entry 4');
				assert.strictEqual(entry4.htmlUrl, 'http://mock-feeds.com/valid/001/entry-4');
				assert.strictEqual(entry4.guid, 'http://mock-feeds.com/valid/001/entry-id-4');
				assert.strictEqual(entry4.content, '<p>Entry 4 Content</p>');
			});

			it('redirects to the created feed page', () => {
				assert.strictEqual(response.statusCode, 302);
				assert.strictEqual(response.headers.location, `/feeds/${feed._id}`);
			});

			describe('GET /feeds/:id', () => {

				before(async () => {
					response = await request('GET', `/feeds/${feed._id}`, {
						headers: {
							cookie: loginCookie
						}
					});
				});

				it('includes a notice that the feed has been subscribed to', () => {
					const {document} = response.dom();
					const messages = document.querySelectorAll('[data-test=subscribe-success]');
					assert.lengthOf(messages, 1);
				});

			});

		});

		describe('when an invalid `feed` property is sent', () => {

			describe('feed URL errors', () => {

				before(async () => {
					await seedDatabase(['settings']);
					response = await request('POST', '/subscribe', {
						headers: {
							cookie: await getLoginCookie('password')
						},
						form: {
							xmlUrl: 'http://mock-feeds.com/error/404/feed.xml'
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
					assert.lengthOf(errors, 1);
					assert.strictEqual(errors[0].textContent, 'Feed URL responded with an error status');
				});

				it('includes a form to subscribe to a feed', () => {
					assertHasSubscribeForm(response);
				});

			});

			describe('feed URL is not a feed', () => {

				before(async () => {
					await seedDatabase(['settings']);
					response = await request('POST', '/subscribe', {
						headers: {
							cookie: await getLoginCookie('password')
						},
						form: {
							xmlUrl: 'http://mock-feeds.com/error/html/feed.html'
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
					assert.lengthOf(errors, 1);
					assert.strictEqual(errors[0].textContent, 'Feed URL is not a valid ATOM or RSS feed');
				});

				it('includes a form to subscribe to a feed', () => {
					assertHasSubscribeForm(response);
				});

			});

			describe('feed URL has non-feed XML', () => {

				before(async () => {
					await seedDatabase(['settings']);
					response = await request('POST', '/subscribe', {
						headers: {
							cookie: await getLoginCookie('password')
						},
						form: {
							xmlUrl: 'http://mock-feeds.com/error/non-feed/feed.xml'
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
					assert.lengthOf(errors, 1);
					assert.strictEqual(errors[0].textContent, 'Feed URL is not a valid ATOM or RSS feed');
				});

				it('includes a form to subscribe to a feed', () => {
					assertHasSubscribeForm(response);
				});

			});

		});

	});

	describe('when the app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('POST', '/subscribe', {
				form: {
					xmlUrl: 'http://mock-feeds.com/valid/001/feed.xml'
				}
			});
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/subscribe');
		});

	});

	describe('when the app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('POST', '/subscribe', {
				form: {
					xmlUrl: 'http://mock-feeds.com/valid/001/feed.xml'
				}
			});
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

// Helper functions for these tests

function assertHasSubscribeForm(response) {
	const {document} = response.dom();

	const form = document.querySelector('form');
	assert.isNotNull('form');
	assert.strictEqual(form.getAttribute('method'), 'post');
	assert.strictEqual(form.getAttribute('action'), '/subscribe');

	const xmlUrlInput = form.querySelector('input[name=xmlUrl]');
	assert.isNotNull(xmlUrlInput);
	assert.strictEqual(xmlUrlInput.getAttribute('type'), 'url');

	const submitButton = form.querySelector('input[type=submit]');
	assert.isNotNull(submitButton);
}
