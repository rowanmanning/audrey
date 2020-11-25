'use strict';

const FeedParser = require('feedparser');
const got = require('got');
const EventEmitter = require('events');

module.exports = function fetchFeed(url) {

	// Create an event emitter to pass data through
	const emitter = new EventEmitter();

	// Create a feed parser
	const feedParser = new FeedParser();
	feedParser.on('error', error => emitter.emit('error', error));
	feedParser.on('meta', meta => {
		emitter.emit('info', meta);
	});
	feedParser.on('readable', () => {
		let entry;
		while (entry = feedParser.read()) {
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
