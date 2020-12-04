'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../helper/get-login-cookie');
const seedDatabase = require('../helper/seed-database');
const request = require('../helper/request');

describe('GET /', () => {
	let response;

	describe('when app has been configured, but no feeds have been added', () => {

		before(async () => {
			await seedDatabase([
				'settings'
			]);
			response = await request('GET', '/', {
				headers: {
					cookie: await getLoginCookie('password')
				}
			});
		});

		it('displays a home page', () => {
			assert.strictEqual(response.statusCode, 200);
			assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

			const {document} = response.dom();
			assert.strictEqual(
				document.querySelector('title').textContent,
				'Test Audrey'
			);
		});

	});

});
