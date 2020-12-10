'use strict';

const addDays = require('date-fns/addDays');
const formatISO = require('date-fns/formatISO');
const nock = require('nock');

const publishDate = addDays(new Date('2020-01-01T00:00:00Z'), 100);

function createEntryMarkup(number, days) {
	return `
		<entry>
			<title>Mock Feed 002 - Entry ${number}</title>
			<link rel="alternate" type="text/html" href="http://mock-feeds.com/valid/002/entry-${number}"/>
			<id>http://mock-feeds.com/valid/002/entry-id-${number}</id>
			<updated>${formatISO(addDays(publishDate, days))}</updated>
			<content type="html"><![CDATA[<p>Entry ${number} Content</p>]]></content>
			<author>
				<name>Mock Feed 002 Author</name>
			</author>
		</entry>
	`;
}

const entries = Object.keys(Array(100).fill(0)).reverse().map((key, index) => {
	return createEntryMarkup(index + 1, -key);
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
			<updated>${formatISO(publishDate)}</updated>

			${entries.join('\n')}

		</feed>
	`, {
		'Content-Type': 'application/xml'
	});
