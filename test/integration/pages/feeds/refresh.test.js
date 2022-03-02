'use strict';

const {assert} = require('chai');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const request = require('../../helper/request');

describe('POST /feeds/:id/refresh', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe(':id is a valid feed ID', () => {
			let loginCookie;

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				loginCookie = await getLoginCookie('password');
				response = await request('POST', '/feeds/feed001/refresh', {
					headers: {
						cookie: loginCookie
					}
				});
			});

			it('refreshes the feed, loading all new entries', async () => {
				const allEntries = await global.app.models.Entry.find({feed: 'feed001'});
				assert.lengthOf(allEntries, 4);
				assert.isTrue(allEntries.every(entry => entry.syncedAt > new Date('2020-01-04T00:00:00Z')));
			});

			it('redirects to the feed page', () => {
				assert.strictEqual(response.statusCode, 302);
				assert.strictEqual(response.headers.location, '/feeds/feed001');
			});

			describe('GET /feeds/:id', () => {

				before(async () => {
					response = await request('GET', '/feeds/feed001', {
						headers: {
							cookie: loginCookie
						}
					});
				});

				it('includes a notice that the feed has been refreshed', () => {
					const {document} = response.dom();
					const messages = document.querySelectorAll('[data-test=refresh-success]');
					assert.lengthOf(messages, 1);
				});

			});

		});

		describe(':id is an invalid feed ID', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('POST', '/feeds/notanentry/refresh', {
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
			response = await request('POST', '/feeds/feed001/refresh');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/feeds/feed001/refresh');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('POST', '/feeds/feed001/refresh');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});
