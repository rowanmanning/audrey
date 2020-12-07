'use strict';

const formatISO = require('date-fns/formatISO');
const nock = require('nock');

const oneDay = 1000 * 60 * 60 * 24;

function createEntryMarkup(number, dateMod) {
	return `
		<entry>
			<title>Mock Feed 002 - Entry ${number}</title>
			<link rel="alternate" type="text/html" href="http://mock-feeds.com/valid/002/entry-${number}"/>
			<id>http://mock-feeds.com/valid/002/entry-id-${number}</id>
			<updated>${formatISO(new Date(Date.now() + dateMod))}</updated>
			<content type="html"><![CDATA[<p>Entry ${number} Content</p>]]></content>
			<author>
				<name>Mock Feed 002 Author</name>
			</author>
		</entry>
	`;
}

const entries = Object.keys(Array(100).fill(0)).reverse().map((key, index) => {
	return createEntryMarkup(index + 1, -(oneDay * (key + 10)));
});

nock('http://mock-feeds.com/')
	.persist()
	.get('/valid/002/feed.xml')
	.reply(200, `
		<?xml version="1.0" encoding="utf-8"?>
		<feed xmlns="http://www.w3.org/2005/Atom">
		
			<title>Mock Feed 002</title>
			<link href="http://mock-feeds.com/valid/002/feed.xml" rel="self" />
			<link href="http://mock-feeds.com/valid/002/" />
			<id>http://mock-feeds.com/valid/002/</id>
			<updated>${formatISO(new Date(Date.now() - oneDay))}</updated>

			${entries.join('\n')}

		</feed>
	`, {
		'Content-Type': 'application/xml'
	});
