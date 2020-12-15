'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const request = require('../../helper/request');
const wait = require('../../helper/wait');

describe('POST /feeds/refresh', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		before(async () => {
			await seedDatabase([
				'settings',
				'feed-001',
				'feed-002',
				'feed-003'
			]);
			response = await request('POST', '/feeds/refresh', {
				headers: {
					cookie: await getLoginCookie('password')
				}
			});
		});

		after(async () => {
			while (global.app.models.Feed.isRefreshInProgress()) {
				await wait(50);
			}
		});

		it('refreshes all feeds', () => {
			assert.isTrue(global.app.models.Feed.isRefreshInProgress());
		});

		it('redirects to the feeds page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/feeds');
		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase([
				'settings',
				'feed-001',
				'feed-002',
				'feed-003'
			]);
			response = await request('POST', '/feeds/refresh');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/feeds/refresh');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('POST', '/feeds/refresh');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});
