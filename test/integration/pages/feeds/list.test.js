'use strict';

const {assert} = require('chai');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const request = require('../../helper/request');
const td = require('testdouble');

describe('GET /feeds', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		describe('feeds are present', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001',
					'feed-002',
					'feed-003'
				]);
				response = await request('GET', '/feeds', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the all feeds page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Feeds | Test Audrey'
				);
				assert.strictEqual(
					document.querySelector('h1').textContent,
					'Feeds'
				);
			});

			it('includes breadcrumbs for parent pages', () => {
				const {document} = response.dom();
				const breadcrumbs = document.querySelectorAll('[data-test=breadcrumb]');
				assert.lengthOf(breadcrumbs, 1);
				assert.strictEqual(breadcrumbs[0].getAttribute('href'), '/');
				assert.strictEqual(breadcrumbs[0].textContent, 'Test Audrey');
			});

			it('lists all feeds', () => {
				const {document} = response.dom();
				const feeds = document.querySelectorAll('[data-test=feed-summary]');
				assert.lengthOf(feeds, 3);

				assert.strictEqual(
					feeds[0].querySelector('[data-test=feed-heading]').textContent,
					'Mock Feed 001'
				);
				assert.isNotNull(feeds[0].querySelector('a[href="/feeds/feed001"]'));

				assert.strictEqual(
					feeds[1].querySelector('[data-test=feed-heading]').textContent,
					'Mock Feed 002'
				);
				assert.isNotNull(feeds[1].querySelector('a[href="/feeds/feed002"]'));

				assert.strictEqual(
					feeds[2].querySelector('[data-test=feed-heading]').textContent,
					'Mock Feed 003'
				);
				assert.isNotNull(feeds[2].querySelector('a[href="/feeds/feed003"]'));
			});

			it('includes a link to the subscribe page', () => {
				const {document} = response.dom();
				assert.isNotNull(document.querySelector('[data-test=main] a[href="/subscribe"]'));
			});

			it('displays a "refresh all feeds" form', () => {
				assertHasRefreshAllFeedsForm(response);
			});

			it('includes a link to export feeds as OPML', () => {
				const {document} = response.dom();
				assert.isNotNull(document.querySelector('a[href="/feeds/export/opml"]'));
			});

			it('does not include a notice that there are no feeds', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=no-feeds-message]');
				assert.isNull(message);
			});

			it('does not include a message that feeds are refreshing', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=feeds-refreshing-message]');
				assert.isNull(message);
			});

			it('does not include a message that a feed has been unsubscribed from', () => {
				const {document} = response.dom();
				const message = document.querySelector('[data-test=unsubscribe-success]');
				assert.isNull(message);
			});

		});

		describe('feeds are present and a refresh is in progress', () => {

			before(async () => {
				await seedDatabase([
					'settings',
					'feed-001',
					'feed-002',
					'feed-003'
				]);
				td.replace(global.app.models.Feed, 'isRefreshInProgress');
				td.when(global.app.models.Feed.isRefreshInProgress(), {ignoreExtraArgs: true}).thenReturn(true);
				response = await request('GET', '/feeds', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			after(() => {
				td.reset();
			});

			it('displays the all feeds page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Feeds | Test Audrey'
				);
				assert.strictEqual(
					document.querySelector('h1').textContent,
					'Feeds'
				);
			});

			it('includes a message that feeds are refreshing', () => {
				const {document} = response.dom();
				const messages = document.querySelectorAll('[data-test=feeds-refreshing-message]');
				assert.lengthOf(messages, 1);
			});

		});

		describe('no feeds are present', () => {

			before(async () => {
				await seedDatabase([
					'settings'
				]);
				response = await request('GET', '/feeds', {
					headers: {
						cookie: await getLoginCookie('password')
					}
				});
			});

			it('displays the all feeds page', () => {
				assert.strictEqual(response.statusCode, 200);
				assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');

				const {document} = response.dom();
				assert.strictEqual(
					document.querySelector('title').textContent,
					'Feeds | Test Audrey'
				);
				assert.strictEqual(
					document.querySelector('h1').textContent,
					'Feeds'
				);
			});

			it('does not list feeds', () => {
				const {document} = response.dom();
				const feeds = document.querySelectorAll('[data-test=feed-summary]');
				assert.lengthOf(feeds, 0);
			});

			it('includes a notice that there are no feeds', () => {
				const {document} = response.dom();
				const messages = document.querySelectorAll('[data-test=no-feeds-message]');
				assert.lengthOf(messages, 1);
			});

		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/feeds');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/feeds');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/feeds');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});

// Helper functions for these tests

function assertHasRefreshAllFeedsForm(response) {
	const {document} = response.dom();

	const form = document.querySelector('form[action="/feeds/refresh"]');
	assert.isNotNull('form');
	assert.strictEqual(form.getAttribute('method'), 'post');

	const submitButton = form.querySelector('input[type=submit]');
	assert.isNotNull(submitButton);
}
