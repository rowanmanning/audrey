'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../helper/get-login-cookie');
const seedDatabase = require('../helper/seed-database');
const request = require('../helper/request');

describe('GET /entries/:id', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe(':id is a valid entry ID', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('GET', '/entries/feed001-entry1', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('marks the entry as read', async () => {
				const entry = await global.app.models.Entry.findById('feed001-entry1');
				assert.isTrue(entry.isRead);
				assert.isNotNull(entry.readAt);
			});

			it('displays the entry view page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Mock Feed 001 - Entry 1 | Test Audrey'
				);
				assert.strictEqual(
					document.querySelector('h1').textContent,
					'Mock Feed 001 - Entry 1'
				);

				const entryHeading = document.querySelector('[data-test=entry-heading]');
				assert.isNotNull(entryHeading);
				assert.strictEqual(entryHeading.innerHTML, 'Mock Feed 001 - Entry 1');

				const entryContent = document.querySelector('[data-test=entry-content]');
				assert.isNotNull(entryContent);
				assert.strictEqual(entryContent.innerHTML, '<p>Entry 1 Content</p>');

				const entryLink = document.querySelector('a[href="http://mock-feeds.com/valid/001/entry-1"]');
				assert.isNotNull(entryLink);
			});

			it('includes breadcrumbs for parent pages', () => {
				const {document} = response.dom();
				const breadcrumbs = document.querySelectorAll('[data-test=breadcrumb]');
				assert.lengthEquals(breadcrumbs, 3);
				assert.strictEqual(breadcrumbs[0].getAttribute('href'), '/');
				assert.strictEqual(breadcrumbs[0].textContent, 'Test Audrey');
				assert.strictEqual(breadcrumbs[1].getAttribute('href'), '/feeds');
				assert.strictEqual(breadcrumbs[1].textContent, 'Feeds');
				assert.strictEqual(breadcrumbs[2].getAttribute('href'), '/feeds/feed001');
				assert.strictEqual(breadcrumbs[2].textContent, 'Mock Feed 001');
			});

			it('includes a link to the original article', () => {
				const {document} = response.dom();
				assert.isNotNull(document.querySelector('a[href="http://mock-feeds.com/valid/001/entry-1"]'));
			});

			it('includes a link to the feed XML', () => {
				const {document} = response.dom();
				assert.isNotNull(document.querySelector('a[href="http://mock-feeds.com/valid/001/feed.xml"]'));
			});

			it('displays an entry "mark as unread" form', () => {
				assertHasMarkAsUnreadForm('feed001-entry1', response);
			});

			it('displays an entry "bookmark" form', () => {
				assertHasBookmarkForm('feed001-entry1', response);
			});

		});

		describe(':id is a bookmarked entry', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('GET', '/entries/feed001-entry2', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays an entry "unbookmark" form', () => {
				assertHasUnbookmarkForm('feed001-entry2', response);
			});

		});

		describe('the entry has unsafe HTML as content', () => {
			it('displays purified HTML content');
		});

		describe('the `autoMarkAsRead` setting is set to `false`', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				const settings = await global.app.models.Settings.get();
				settings.autoMarkAsRead = false;
				await settings.save();
				response = await request('GET', '/entries/feed001-entry2', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('does not mark the entry as read', async () => {
				const entry = await global.app.models.Entry.findById('feed001-entry1');
				assert.isFalse(entry.isRead);
				assert.isNull(entry.readAt);
			});

		});

		describe(':id is an invalid entry ID', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('GET', '/entries/notanentry', {
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
			response = await request('GET', '/entries/feed001-entry1');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/entries/feed001-entry1');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/entries/feed001-entry1');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

describe('GET /entries/:id?nomark', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe(':id is a valid entry ID', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001'
				]);
				response = await request('GET', '/entries/feed001-entry1?nomark', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('does not mark the entry as read', async () => {
				const entry = await global.app.models.Entry.findById('feed001-entry1');
				assert.isFalse(entry.isRead);
				assert.isNull(entry.readAt);
			});

			it('displays an entry "mark as read" form', () => {
				assertHasMarkAsReadForm('feed001-entry1', response);
			});

		});

	});

});

// Helper functions for these tests

function assertHasMarkAsReadForm(entryId, response) {
	assertHasStatusForm('read', entryId, response);
}

function assertHasMarkAsUnreadForm(entryId, response) {
	assertHasStatusForm('unread', entryId, response);
}

function assertHasBookmarkForm(entryId, response) {
	assertHasStatusForm('bookmark', entryId, response);
}

function assertHasUnbookmarkForm(entryId, response) {
	assertHasStatusForm('unbookmark', entryId, response);
}

function assertHasStatusForm(status, entryId, response) {
	const {document} = response.dom();

	const hiddenInput = document.querySelector(`input[name=setStatus][value=${status}]`);
	assert.isNotNull(hiddenInput);
	assert.strictEqual(hiddenInput.getAttribute('type'), 'hidden');

	const form = hiddenInput.closest('form');
	assert.isNotNull('form');
	assert.strictEqual(form.getAttribute('method'), 'post');
	assert.strictEqual(form.getAttribute('action'), `/entries/${entryId}/mark`);

	const submitButton = form.querySelector('input[type=submit]');
	assert.isNotNull(submitButton);
}
