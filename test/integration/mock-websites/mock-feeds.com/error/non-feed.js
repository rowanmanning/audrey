'use strict';

const nock = require('nock');

nock('http://mock-feeds.com/')
	.persist()
	.get('/error/non-feed/feed.xml')
	.reply(200, `
		<?xml version="1.0" encoding="utf-8"?>
		<notafeed>		
			<title>Mock Non Feed</title>
		</notafeed>
	`, {
		'Content-Type': 'application/xml'
	});
