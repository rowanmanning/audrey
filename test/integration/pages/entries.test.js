'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../helper/get-login-cookie');
const seedDatabase = require('../helper/seed-database');
const request = require('../helper/request');

describe('GET /entries', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe('feeds are present and entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('GET', '/entries', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the all entries page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'All Entries | Test Audrey'
				);
			});

			it('lists all entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthEquals(entries, 3);

				assert.strictEqual(
					entries[0].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 001 - Entry 3'
				);
				assert.isNotNull(entries[0].querySelector('a[href="/entries/feed001-entry3"]'));

				assert.strictEqual(
					entries[1].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 001 - Entry 2'
				);
				assert.isNotNull(entries[1].querySelector('a[href="/entries/feed001-entry2"]'));

				assert.strictEqual(
					entries[2].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 001 - Entry 1'
				);
				assert.isNotNull(entries[2].querySelector('a[href="/entries/feed001-entry1"]'));
			});

			it('does not include pagination', () => {
				const {document} = response.dom();
				const pagination = document.querySelector('[data-test=pagination]');
				assert.isNull(pagination);
			});

			it('does not include a notice that there are no entries', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=no-entries-message]');
				assert.isNull(message);
			});

		});

		describe('feeds are present and more than 50 entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-002'
				]);
				response = await request('GET', '/entries', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('lists the latest 50 entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthEquals(entries, 50);

				assert.strictEqual(
					entries[0].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 100'
				);
				assert.strictEqual(
					entries[1].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 99'
				);
				assert.strictEqual(
					entries[49].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 51'
				);
			});

			it.skip('includes pagination', () => {
				const {document} = response.dom();
				const next = document.querySelectorAll('[data-test=pagination-next]');
				assert.lengthEquals(next, 1);
				assert.strictEqual(next[0].getAttribute('href'), '/entries?before=???');
				// TODO requires us to have fixed dates in our fixtures
			});

		});

		describe('feeds are present but no entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001',
					'delete-all-entries'
				]);
				response = await request('GET', '/entries', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the all entries page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'All Entries | Test Audrey'
				);
			});

			it('includes a notice that there are no entries', () => {
				const {document} = response.dom();
				const messages = document.querySelectorAll('[data-test=no-entries-message]');
				assert.lengthEquals(messages, 1);
			});

			it('lists no entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthEquals(entries, 0);
			});

		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/entries');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/entries');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/entries');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

describe.skip('GET /entries?before=???', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe('feeds are present and more than 50 entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-002'
				]);
				response = await request('GET', '/entries?before=???', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('lists the second page of entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthEquals(entries, 50);

				assert.strictEqual(
					entries[0].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 50'
				);
				assert.strictEqual(
					entries[1].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 49'
				);
				assert.strictEqual(
					entries[49].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 002 - Entry 1'
				);
			});

			it('does not include pagination', () => {
				const {document} = response.dom();
				const pagination = document.querySelector('[data-test=pagination]');
				assert.isNull(pagination);
			});

		});

	});

});
