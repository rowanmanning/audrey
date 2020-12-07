'use strict';

const nock = require('nock');

nock('http://mock-feeds.com/')
	.persist()
	.get('/error/html/feed.html')
	.reply(200, `
		<p>Nope</p>
	`, {
		'Content-Type': 'text/html'
	});
