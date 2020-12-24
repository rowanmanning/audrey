'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const {readFile} = require('fs').promises;
const request = require('../../helper/request');

describe('GET /entries/test', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		before(async () => {
			await seedDatabase([
				'settings'
			]);
			response = await request('GET', '/entries/test', {
				headers: {
					cookie: await getLoginCookie('password')
				}
			});
		});

		it('displays the entry view page', () => {
			assert.strictEqual(response.statusCode, 200);
			assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

			const {document} = response.dom();
			assert.strictEqual(
				document.querySelector('title').textContent,
				'Test Entry | Test Audrey'
			);
			assert.strictEqual(
				document.querySelector('h1').textContent,
				'Test Entry'
			);

			const entryHeading = document.querySelector('[data-test=entry-heading]');
			assert.isNotNull(entryHeading);
			assert.strictEqual(entryHeading.innerHTML, 'Test Entry');
		});

		it('displays purified entry content', async () => {
			const {document} = response.dom();
			const expectedContent = await readFile(`${__dirname}/../../../../data/test-entry-purified.html`, 'utf-8');
			const entryContent = document.querySelector('[data-test=entry-content]');
			assert.isNotNull(entryContent);
			assert.strictEqual(entryContent.innerHTML.trim().replace(/[ \t]+/g, ' '), expectedContent.trim().replace(/[ \t]+/g, ' '));
		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/entries/test');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/entries/test');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/entries/test');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});
