'use strict';

const nock = require('nock');

nock('http://mock-feeds.com/')
	.persist()
	.get('/error/404/feed.xml')
	.reply(404, `
		<p>Nope</p>
	`, {
		'Content-Type': 'text/html'
	});
