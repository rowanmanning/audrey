'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../helper/get-login-cookie');
const seedDatabase = require('../helper/seed-database');
const request = require('../helper/request');

describe('POST /feeds/:id/mark', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe(':id is a valid feed ID', () => {

			describe('when the `setStatus` parameter is "read"', () => {

				before(async () => {
					await seedDatabase([
						'settings',
						'feed-001'
					]);
					response = await request('POST', '/feeds/feed001/mark', {
						headers: {
							cookie: await getLoginCookie('password')
						},
						form: {
							setStatus: 'read'
						}
					});
				});

				it('marks all entries in the feed as read', async () => {
					const allEntries = await global.app.models.Entry.find();
					const readEntries = await global.app.models.Entry.find({isRead: true});
					assert.strictEqual(readEntries.length, allEntries.length);
				});

				it('redirects to the feed page', () => {
					assert.strictEqual(response.statusCode, 302);
					assert.strictEqual(response.headers.location, '/feeds/feed001');
				});

			});

			describe('when the `setStatus` parameter is "unread"', () => {

				before(async () => {
					await seedDatabase([
						'settings',
						'feed-001'
					]);
					response = await request('POST', '/feeds/feed001/mark', {
						headers: {
							cookie: await getLoginCookie('password')
						},
						form: {
							setStatus: 'unread'
						}
					});
				});

				it('marks all entries in the feed as unread', async () => {
					const allEntries = await global.app.models.Entry.find();
					const unreadEntries = await global.app.models.Entry.find({isRead: false});
					assert.strictEqual(unreadEntries.length, allEntries.length);
				});

				it('redirects to the feed page', () => {
					assert.strictEqual(response.statusCode, 302);
					assert.strictEqual(response.headers.location, '/feeds/feed001');
				});

			});

			describe('when the `setStatus` parameter is unrecognised', () => {

				before(async () => {
					await seedDatabase([
						'settings',
						'feed-001'
					]);
					response = await request('POST', '/feeds/feed001/mark', {
						headers: {
							cookie: await getLoginCookie('password')
						},
						form: {
							setStatus: 'nope'
						}
					});
				});

				it('does nothing to the entries', async () => {
					const entry1 = await global.app.models.Entry.findById('feed001-entry1');
					assert.isFalse(entry1.isRead);
					const entry2 = await global.app.models.Entry.findById('feed001-entry2');
					assert.isFalse(entry2.isRead);
					const entry3 = await global.app.models.Entry.findById('feed001-entry3');
					assert.isTrue(entry3.isRead);
				});

				it('redirects to the feed page', () => {
					assert.strictEqual(response.statusCode, 302);
					assert.strictEqual(response.headers.location, '/feeds/feed001');
				});

			});

		});

		describe(':id is an invalid feed ID', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('POST', '/feeds/notanentry/mark', {
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
			response = await request('POST', '/feeds/feed001/mark');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/feeds/feed001/mark');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('POST', '/feeds/feed001/mark');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});
