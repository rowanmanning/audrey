'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const request = require('../../helper/request');

describe('GET /feeds/:id', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe(':id is a valid feed ID', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001',
					'feed-002'
				]);
				response = await request('GET', '/feeds/feed001', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the feed view page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Mock Feed 001 | Test Audrey'
				);
				assert.strictEqual(
					document.querySelector('h1').textContent,
					'Mock Feed 001'
				);

				const entryHeading = document.querySelector('[data-test=feed-heading]');
				assert.isNotNull(entryHeading);
				assert.strictEqual(entryHeading.innerHTML, 'Mock Feed 001');
			});

			it('lists all entries in the feed', () => {
				const {document} = response.dom();
				const entries = document.querySelectorAll('[data-test=entry-summary]');
				assert.lengthEquals(entries, 3);

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

			it('includes breadcrumbs for parent pages', () => {
				const {document} = response.dom();
				const breadcrumbs = document.querySelectorAll('[data-test=breadcrumb]');
				assert.lengthEquals(breadcrumbs, 2);
				assert.strictEqual(breadcrumbs[0].getAttribute('href'), '/');
				assert.strictEqual(breadcrumbs[0].textContent, 'Test Audrey');
				assert.strictEqual(breadcrumbs[1].getAttribute('href'), '/feeds');
				assert.strictEqual(breadcrumbs[1].textContent, 'Feeds');
			});

			it('includes a link to the feed website', () => {
				const {document} = response.dom();
				assert.isNotNull(document.querySelector('a[href="http://mock-feeds.com/valid/001/"]'));
			});

			it('includes a link to the feed XML', () => {
				const {document} = response.dom();
				assert.isNotNull(document.querySelector('a[href="http://mock-feeds.com/valid/001/feed.xml"]'));
			});

			it('includes a link to the feed settings', () => {
				const {document} = response.dom();
				assert.isNotNull(document.querySelector('a[href="/feeds/feed001/settings"]'));
			});

			it('displays a feed "refresh" form', () => {
				assertHasRefreshForm('feed001', response);
			});

			it('displays an entry "mark all as read" form', () => {
				assertHasMarkAsReadForm('feed001', response);
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

			it('does not include a notice that the feed has been refreshed', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=refresh-success]');
				assert.isNull(message);
			});

			it('does not include a notice that the feed has been subscribed to', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=subscribe-success]');
				assert.isNull(message);
			});

		});

		describe(':id is a valid feed ID with no unread entries', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001',
					'feed-002',
					'mark-all-entries-as-read'
				]);
				response = await request('GET', '/feeds/feed001', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays an entry "mark all as unread" form', () => {
				assertHasMarkAsUnreadForm('feed001', response);
			});

		});

		describe(':id is a valid feed ID with more than 50 entries', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001',
					'feed-002'
				]);
				response = await request('GET', '/feeds/feed002', {
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

			it('includes pagination', () => {
				const {document} = response.dom();
				const next = document.querySelectorAll('[data-test=pagination-next]');
				assert.lengthEquals(next, 1);

				// 51 days from January first
				assert.strictEqual(next[0].getAttribute('href'), '/feeds/feed002?before=2020-02-21T00%3A00%3A00.000Z');
			});

		});

		describe(':id is a valid feed ID with no entries', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001',
					'feed-002',
					'delete-all-entries'
				]);
				response = await request('GET', '/feeds/feed001', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
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

		describe(':id is an invalid feed ID', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001',
					'feed-002'
				]);
				response = await request('GET', '/feeds/notafeed', {
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
			response = await request('GET', '/feeds/feed001');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/feeds/feed001');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/feeds/feed001');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

// 51 days from January first
describe('GET /feeds/:id?before=2020-02-21T00%3A00%3A00.000Z', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe('feeds are present and more than 50 entries are available', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001',
					'feed-002'
				]);
				response = await request('GET', '/feeds/feed002?before=2020-02-21T00%3A00%3A00.000Z', {
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

// Helper functions for these tests

function assertHasMarkAsReadForm(feedId, response) {
	assertHasStatusForm('read', feedId, response);
}

function assertHasMarkAsUnreadForm(feedId, response) {
	assertHasStatusForm('unread', feedId, response);
}

function assertHasStatusForm(status, feedId, response) {
	const {document} = response.dom();

	const hiddenInput = document.querySelector(`input[name=setStatus][value=${status}]`);
	assert.isNotNull(hiddenInput);
	assert.strictEqual(hiddenInput.getAttribute('type'), 'hidden');

	const form = hiddenInput.closest('form');
	assert.isNotNull('form');
	assert.strictEqual(form.getAttribute('method'), 'post');
	assert.strictEqual(form.getAttribute('action'), `/feeds/${feedId}/mark`);

	const submitButton = form.querySelector('input[type=submit]');
	assert.isNotNull(submitButton);
}

function assertHasRefreshForm(feedId, response) {
	const {document} = response.dom();

	const form = document.querySelector(`form[action="/feeds/${feedId}/refresh"]`);
	assert.isNotNull('form');
	assert.strictEqual(form.getAttribute('method'), 'post');

	const submitButton = form.querySelector('input[type=submit]');
	assert.isNotNull(submitButton);
}

