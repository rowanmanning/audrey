'use strict';

const FeedParser = require('feedparser');
const got = require('got');
const EventEmitter = require('events');
const cleanUrl = require('../clean-url');

module.exports = function fetchFeed(url) {

	// Create an event emitter to pass data through
	const emitter = new EventEmitter();

	// Create a feed parser
	const feedParser = new FeedParser();
	feedParser.on('error', error => emitter.emit('error', error));
	feedParser.on('meta', meta => {

		// Clean up core feed URLs
		meta.origlink = meta.origlink ? cleanUrl(meta.origlink) : meta.origlink;
		meta.link = meta.link ? cleanUrl(meta.link) : meta.link;
		meta.xmlUrl = meta.xmlurl = meta.xmlUrl ? cleanUrl(meta.xmlUrl) : meta.xmlUrl;

		emitter.emit('info', meta);
	});
	feedParser.on('readable', () => {
		let entry;
		while (entry = feedParser.read()) {
			// Clean up entry URLs
			entry.link = entry.link ? cleanUrl(entry.link) : entry.link;
			emitter.emit('entry', entry);
		}
	});

	// Request the XML and stream the response into the feed parser
	const xmlStream = got.stream(url);
	xmlStream.on('error', error => emitter.emit('error', error));
	xmlStream.pipe(feedParser);

	// Return the emitter
	emitter.xmlStream = xmlStream;
	emitter.feedParser = feedParser;
	return emitter;
};
