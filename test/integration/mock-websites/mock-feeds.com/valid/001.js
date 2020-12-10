'use strict';

const formatISO = require('date-fns/formatISO');
const nock = require('nock');

function createEntryMarkup(number, date) {
	return `
		<entry>
			<title>Mock Feed 001 - Entry ${number}</title>
			<link rel="alternate" type="text/html" href="http://mock-feeds.com/valid/001/entry-${number}"/>
			<id>http://mock-feeds.com/valid/001/entry-id-${number}</id>
			<updated>${formatISO(date)}</updated>
			<content type="html"><![CDATA[<p>Entry ${number} Content</p>]]></content>
			<author>
				<name>Mock Feed 001 Author</name>
			</author>
		</entry>
	`;
}

const entries = [
	createEntryMarkup(1, new Date('2020-01-01T00:00:00Z')),
	createEntryMarkup(2, new Date('2020-01-02T00:00:00Z')),
	createEntryMarkup(3, new Date('2020-01-03T00:00:00Z'))
];

nock('http://mock-feeds.com/')
	.persist()
	.get('/valid/001/feed.xml')
	.reply(200, `
		<?xml version="1.0" encoding="utf-8"?>
		<feed xmlns="http://www.w3.org/2005/Atom">
		
			<title>Mock Feed 001</title>
			<link href="http://mock-feeds.com/valid/001/feed.xml" rel="self" />
			<link href="http://mock-feeds.com/valid/001/" />
			<id>http://mock-feeds.com/valid/001/</id>
			<updated>${formatISO(new Date('2020-01-03T00:00:00Z'))}</updated>

			${entries.join('\n')}

		</feed>
	`, {
		'Content-Type': 'application/xml'
	});
