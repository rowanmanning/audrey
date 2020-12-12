'use strict';

const assert = require('proclaim');
const getLoginCookie = require('../helper/get-login-cookie');
const seedDatabase = require('../helper/seed-database');
const request = require('../helper/request');

describe('GET /feeds.opml', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		before(async () => {
			await seedDatabase([
				'settings',
				'feed-001',
				'feed-002',
				'feed-003'
			]);
			response = await request('GET', '/feeds.opml', {
				headers: {
					cookie: await getLoginCookie('password')
				}
			});
		});

		it('prompts to download all feeds as OPML', () => {
			assert.strictEqual(response.statusCode, 200);

			assert.strictEqual(response.headers['content-description'], 'File Transfer');
			assert.strictEqual(response.headers['content-disposition'], `attachment; filename=Test Audrey Feed Export.opml`);
			assert.strictEqual(response.headers['content-transfer-encoding'], 'binary');
			assert.strictEqual(response.headers['content-type'], 'application/octet-stream; charset=utf-8');

			const {document} = response.dom();
			const opml = document.querySelector('opml');
			assert.isNotNull(opml);
			assert.strictEqual(opml.getAttribute('version'), '1.0');

			const title = opml.querySelector('title');
			assert.isNotNull(title);
			assert.strictEqual(title.textContent, 'Test Audrey Feed Export');

			const outlines = opml.querySelectorAll('outline');
			assert.lengthEquals(outlines, 3);

			assert.strictEqual(outlines[0].getAttribute('type'), 'rss');
			assert.strictEqual(outlines[0].getAttribute('text'), 'Mock Feed 001');
			assert.strictEqual(outlines[0].getAttribute('title'), 'Mock Feed 001');
			assert.strictEqual(outlines[0].getAttribute('xmlUrl'), 'http://mock-feeds.com/valid/001/feed.xml');
			assert.strictEqual(outlines[0].getAttribute('htmlUrl'), 'http://mock-feeds.com/valid/001/');

			assert.strictEqual(outlines[1].getAttribute('type'), 'rss');
			assert.strictEqual(outlines[1].getAttribute('text'), 'Mock Feed 002');
			assert.strictEqual(outlines[1].getAttribute('title'), 'Mock Feed 002');
			assert.strictEqual(outlines[1].getAttribute('xmlUrl'), 'http://mock-feeds.com/valid/002/feed.xml');
			assert.strictEqual(outlines[1].getAttribute('htmlUrl'), 'http://mock-feeds.com/valid/002/');

			assert.strictEqual(outlines[2].getAttribute('type'), 'rss');
			assert.strictEqual(outlines[2].getAttribute('text'), 'Mock Feed 003');
			assert.strictEqual(outlines[2].getAttribute('title'), 'Mock Feed 003');
			assert.strictEqual(outlines[2].getAttribute('xmlUrl'), 'http://mock-feeds.com/valid/003/feed.xml');
			assert.strictEqual(outlines[2].getAttribute('htmlUrl'), 'http://mock-feeds.com/valid/003/');
		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/feeds.opml');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/feeds.opml');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/feeds.opml');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});
