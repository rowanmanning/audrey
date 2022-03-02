'use strict';

const {assert} = require('chai');
const getLoginCookie = require('../../helper/get-login-cookie');
const seedDatabase = require('../../helper/seed-database');
const request = require('../../helper/request');

describe('GET /bookmarks/export/html', () => {
	let response;

	describe('when the app is configured and logged in', () => {

		before(async () => {
			await seedDatabase([
				'settings',
				'feed-001',
				'bookmark-all-entries'
			]);
			response = await request('GET', '/bookmarks/export/html', {
				headers: {
					cookie: await getLoginCookie('password')
				}
			});
		});

		it('prompts to download all bookmarked entries as a Netscape bookmarks file', () => {
			assert.strictEqual(response.statusCode, 200);

			assert.strictEqual(response.headers['content-description'], 'File Transfer');
			assert.strictEqual(response.headers['content-disposition'], `attachment; filename=Test Audrey Bookmarks Export.html`);
			assert.strictEqual(response.headers['content-transfer-encoding'], 'binary');
			assert.strictEqual(response.headers['content-type'], 'application/octet-stream; charset=utf-8');

			assert.isTrue(response.body.startsWith(`
				<!DOCTYPE NETSCAPE-Bookmark-file-1>
				<!-- This is an automatically generated file.
				     It will be read and overwritten.
				     DO NOT EDIT! -->
				<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
				<TITLE>Bookmarks</TITLE>
				<H1>Bookmarks Menu</H1>

				<DL><p>
			`.trim().replace(/\t+/g, '')));

			assert.isTrue(response.body.includes('<DT><A HREF="http://mock-feeds.com/valid/001/entry-1">Mock Feed 001 - Entry 1</a>'));
			assert.isTrue(response.body.includes('<DT><A HREF="http://mock-feeds.com/valid/001/entry-2">Mock Feed 001 - Entry 2</a>'));
			assert.isTrue(response.body.includes('<DT><A HREF="http://mock-feeds.com/valid/001/entry-3">Mock Feed 001 - Entry 3</a>'));

			assert.isTrue(response.body.endsWith('</DL><p>'));
		});

	});

	describe('when app is configured but not logged in', () => {

		before(async () => {
			await seedDatabase(['settings']);
			response = await request('GET', '/bookmarks/export/html');
		});

		it('redirects to the login page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/login?redirect=/bookmarks/export/html');
		});

	});

	describe('when app is not configured', () => {

		before(async () => {
			await seedDatabase([]);
			response = await request('GET', '/bookmarks/export/html');
		});

		it('redirects to the home page', () => {
			assert.strictEqual(response.statusCode, 302);
			assert.strictEqual(response.headers.location, '/');
		});

	});

});
