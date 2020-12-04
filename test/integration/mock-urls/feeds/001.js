'use strict';

const formatISO = require('date-fns/formatISO');
const nock = require('nock');

const updatedDate = new Date();

nock('http://mock.feeds/')
	.get('/001/feed.xml')
	.reply(200, `
		<?xml version="1.0" encoding="utf-8"?>
		<feed xmlns="http://www.w3.org/2005/Atom">
		
			<title>Mock Feed 001</title>
			<link href="http://mock.feeds/001/feed.xml" rel="self" />
			<link href="http://mock.feeds/001/" />
			<id>http://mock.feeds/001/</id>
			<updated>${formatISO(updatedDate)}</updated>
			
			<entry>
				<title>Mock Feed 001 - Entry 01</title>
				<link rel="alternate" type="text/html" href="http://mock.feeds/001/entry-01"/>
				<id>http://mock.feeds/001/entry-01</id>
				<updated>${formatISO(updatedDate)}</updated>
				<summary>Entry 01 Summary</summary>
				<content type="html"><p>Entry 01 Content</p></content>
				<author>
					<name>Mock Feed 01 Author</name>
				</author>
			</entry>
		
		</feed>
	`, {
		'Content-Type': 'application/xml'
	});
