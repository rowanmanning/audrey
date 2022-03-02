'use strict';

const {assert} = require('chai');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const request = require('../../helper/request');

describe('GET /bookmarks', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe('feeds are present and bookmarked entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('GET', '/bookmarks', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the bookmarks page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Bookmarked Entries | Test Audrey'
				);
				assert.strictEqual(
					document.querySelector('h1').textContent,
					'Bookmarked Entries'
				);
			});

			it('includes breadcrumbs for parent pages', () => {
				const {document} = response.dom();
				const breadcrumbs = document.querySelectorAll('[data-test=breadcrumb]');
				assert.lengthOf(breadcrumbs, 1);
				assert.strictEqual(breadcrumbs[0].getAttribute('href'), '/');
				assert.strictEqual(breadcrumbs[0].textContent, 'Test Audrey');
			});

			it('lists all bookmarked entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthOf(entries, 1);

				assert.strictEqual(
					entries[0].querySelector('[data-test=entry-heading]').textContent,
					'Mock Feed 001 - Entry 2'
				);
				assert.isNotNull(entries[0].querySelector('a[href="/entries/feed001-entry2"]'));
				assert.isNotNull(entries[0].querySelector('a[href="/feeds/feed001"]'));
			});

			it('includes a link to export bookmarks as HTML', () => {
				const {document} = response.dom();
				assert.isNotNull(document.querySelector('a[href="/bookmarks/export/html"]'));
			});

			it('does not include pagination', () => {
				const {document} = response.dom();
				const pagination = document.querySelector('[data-test=pagination]');
				assert.isNull(pagination);
			});

			it('does not include a notice that there are no bookmarked entries', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=no-bookmarks-message]');
				assert.isNull(message);
			});

		});

		describe('feeds are present and more than 50 bookmarked entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-002',
					'bookmark-all-entries'
				]);
				response = await request('GET', '/bookmarks', {
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
				assert.strictEqual(next[0].getAttribute('href'), '/bookmarks?before=2020-02-21T00%3A00%3A00.000Z');
			});

		});

		describe('feeds are present but no bookmarked entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-002'
				]);
				response = await request('GET', '/bookmarks', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the bookmarks page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Bookmarked Entries | Test Audrey'
				);
			});

			it('includes a notice that there are no bookmarked entries', () => {
				const {document} = response.dom();
				const messages = document.querySelectorAll('[data-test=no-bookmarks-message]');
				assert.lengthOf(messages, 1);
			});

			it('lists no bookmarked entries', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthOf(entries, 0);
			});

		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/bookmarks');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/bookmarks');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/bookmarks');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

// 51 days from January first
describe('GET /bookmarks?before=2020-02-21T00%3A00%3A00.000Z', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe('feeds are present and more than 50 bookmarked entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-002',
					'bookmark-all-entries'
				]);
				response = await request('GET', '/bookmarks?before=2020-02-21T00%3A00%3A00.000Z', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('lists the second page of bookmarked entries', () => {
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
