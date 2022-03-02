'use strict';

const {assert} = require('chai');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const request = require('../../helper/request');

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
				assert.strictEqual(
					document.querySelector('h1').textContent,
					'All Entries'
				);
			});

			it('includes breadcrumbs for parent pages', () => {
				const {document} = response.dom();
				const breadcrumbs = document.querySelectorAll('[data-test=breadcrumb]');
				assert.lengthOf(breadcrumbs, 1);
				assert.strictEqual(breadcrumbs[0].getAttribute('href'), '/');
				assert.strictEqual(breadcrumbs[0].textContent, 'Test Audrey');
			});

			it('lists all entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthOf(entries, 3);

				assert.strictEqual(
					entries[0].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 001 - Entry 3'
				);
				assert.isNotNull(entries[0].querySelector('a[href="/entries/feed001-entry3"]'));
				assert.isNotNull(entries[0].querySelector('a[href="/feeds/feed001"]'));

				assert.strictEqual(
					entries[1].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 001 - Entry 2'
				);
				assert.isNotNull(entries[1].querySelector('a[href="/entries/feed001-entry2"]'));
				assert.isNotNull(entries[1].querySelector('a[href="/feeds/feed001"]'));

				assert.strictEqual(
					entries[2].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 001 - Entry 1'
				);
				assert.isNotNull(entries[2].querySelector('a[href="/entries/feed001-entry1"]'));
				assert.isNotNull(entries[2].querySelector('a[href="/feeds/feed001"]'));
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
				assert.lengthOf(entries, 50);

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

			it('includes pagination', () => {
				const {document} = response.dom();
				const next = document.querySelectorAll('[data-test=pagination-next]');
				assert.lengthOf(next, 1);

				// 51 days from January first
				assert.strictEqual(next[0].getAttribute('href'), '/entries?before=2020-02-21T00%3A00%3A00.000Z');
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
				assert.lengthOf(messages, 1);
			});

			it('lists no entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthOf(entries, 0);
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

// 51 days from January first
describe('GET /entries?before=2020-02-21T00%3A00%3A00.000Z', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe('feeds are present and more than 50 entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-002'
				]);
				response = await request('GET', '/entries?before=2020-02-21T00%3A00%3A00.000Z', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('lists the second page of entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthOf(entries, 50);

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
