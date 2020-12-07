'use strict';

const assert = require('proclaim');
const request = require('../helper/request');

describe('GET http://mock-feeds.com/valid/001/feed.xml', () => {
	let response;

	before(async () => {
		response = await request('GET', 'http://mock-feeds.com/valid/001/feed.xml');
	});

	it('responds with a mock feed XML', () => {
		assert.strictEqual(response.statusCode, 200);
		assert.strictEqual(response.headers['content-type'], 'application/xml');

		const {document} = response.dom();
		assert.strictEqual(
			document.querySelector('title').textContent,
			'Mock Feed 001'
		);
	});

});
