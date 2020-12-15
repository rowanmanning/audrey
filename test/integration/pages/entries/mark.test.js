'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const request = require('../../helper/request');

describe('POST /entries/:id/mark', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe(':id is a valid entry ID', () => {

			describe('when the `setStatus` parameter is "read"', () => {

				before(async () => {
					await seedDatabase([
						'settings',
						'feed-001'
					]);
					response = await request('POST', '/entries/feed001-entry1/mark', {
						headers: {
							cookie: await getLoginCookie('password')
						},
						form: {
							setStatus: 'read'
						}
					});
				});

				it('marks the entry as read', async () => {
					const entry = await global.app.models.Entry.findById('feed001-entry1');
					assert.isTrue(entry.isRead);
					assert.isNotNull(entry.readAt);
				});

				it('redirects to the entry page', () => {
					assert.strictEqual(response.statusCode, 302);
					assert.strictEqual(response.headers.location, '/entries/feed001-entry1?nomark');
				});

			});

			describe('when the `setStatus` parameter is "unread"', () => {

				before(async () => {
					await seedDatabase([
						'settings',
						'feed-001'
					]);
					response = await request('POST', '/entries/feed001-entry3/mark', {
						headers: {
							cookie: await getLoginCookie('password')
						},
						form: {
							setStatus: 'unread'
						}
					});
				});

				it('marks the entry as unread', async () => {
					const entry = await global.app.models.Entry.findById('feed001-entry3');
					assert.isFalse(entry.isRead);
					assert.isNull(entry.readAt);
				});

				it('redirects to the entry page', () => {
					assert.strictEqual(response.statusCode, 302);
					assert.strictEqual(response.headers.location, '/entries/feed001-entry3?nomark');
				});

			});

			describe('when the `setStatus` parameter is "bookmark"', () => {

				before(async () => {
					await seedDatabase([
						'settings',
						'feed-001'
					]);
					response = await request('POST', '/entries/feed001-entry1/mark', {
						headers: {
							cookie: await getLoginCookie('password')
						},
						form: {
							setStatus: 'bookmark'
						}
					});
				});

				it('bookmarks the entry', async () => {
					const entry = await global.app.models.Entry.findById('feed001-entry1');
					assert.isTrue(entry.isBookmarked);
					assert.isNotNull(entry.bookmarkedAt);
				});

				it('redirects to the entry page', () => {
					assert.strictEqual(response.statusCode, 302);
					assert.strictEqual(response.headers.location, '/entries/feed001-entry1?nomark');
				});

			});

			describe('when the `setStatus` parameter is "unbookmark"', () => {

				before(async () => {
					await seedDatabase([
						'settings',
						'feed-001'
					]);
					response = await request('POST', '/entries/feed001-entry2/mark', {
						headers: {
							cookie: await getLoginCookie('password')
						},
						form: {
							setStatus: 'unbookmark'
						}
					});
				});

				it('unbookmarks the entry', async () => {
					const entry = await global.app.models.Entry.findById('feed001-entry2');
					assert.isFalse(entry.isBookmarked);
					assert.isNull(entry.bookmarkedAt);
				});

				it('redirects to the entry page', () => {
					assert.strictEqual(response.statusCode, 302);
					assert.strictEqual(response.headers.location, '/entries/feed001-entry2?nomark');
				});

			});

			describe('when the `setStatus` parameter is unrecognised', () => {

				before(async () => {
					await seedDatabase([
						'settings',
						'feed-001'
					]);
					response = await request('POST', '/entries/feed001-entry1/mark', {
						headers: {
							cookie: await getLoginCookie('password')
						},
						form: {
							setStatus: 'nope'
						}
					});
				});

				it('does nothing to the entry', async () => {
					const entry = await global.app.models.Entry.findById('feed001-entry1');
					assert.isFalse(entry.isRead);
					assert.isNull(entry.readAt);
					assert.isFalse(entry.isBookmarked);
					assert.isNull(entry.bookmarkedAt);
				});

				it('redirects to the entry page', () => {
					assert.strictEqual(response.statusCode, 302);
					assert.strictEqual(response.headers.location, '/entries/feed001-entry1?nomark');
				});

			});

		});

		describe(':id is an invalid entry ID', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('POST', '/entries/notanentry/mark', {
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
			response = await request('POST', '/entries/feed001-entry1/mark');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/entries/feed001-entry1/mark');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('POST', '/entries/feed001-entry1/mark');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});
