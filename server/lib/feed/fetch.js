'use strict';

const FeedParser = require('feedparser');
const got = require('got');

module.exports = function fetchFeed({url, requestOptions, onInfo, onEntry} = {}) {
	return new Promise((resolve, reject) => {

		// A place to store promises created by the
		// info and entry handlers
		const feedProcessingPromises = [];

		// The object to eventually resolve with, used to
		// keep a tally of entries and store some basic
		// feed info
		const result = {
			url,
			title: null,
			entryCount: 0
		};

		// Create a feed parser
		const feedParser = new FeedParser();
		feedParser.on('error', reject);

		// Handle feed meta info
		if (onInfo) {
			feedParser.on('meta', meta => {
				feedProcessingPromises.push(onInfo(meta));
				result.url = meta.xmlUrl;
				result.title = meta.title;
			});
		}

		// Handle feed entries
		feedParser.on('readable', () => {
			let entry;
			while (entry = feedParser.read()) {
				if (onEntry) {
					feedProcessingPromises.push(onEntry(entry));
				}
				result.entryCount += 1;
			}
		});

		// Handle the feed stream ending
		feedParser.on('end', async () => {
			try {

				// Await all of the promises, this catches any errors immediately
				// but later promises continue to be resolved
				await Promise.all(feedProcessingPromises);

				// Everything resolved
				resolve(result);

			} catch (error) {

				// We still only want to reject after all of the promises have been resolved.
				// Now that we've caught the error we can wait for all promises to be settled
				// before we reject
				await Promise.allSettled(feedProcessingPromises);

				// Reject with the original error
				reject(error);

			}
		});

		// Request the XML and stream the response into the feed parser
		const xmlStream = got.stream(url, requestOptions);
		xmlStream.on('error', reject);
		xmlStream.pipe(feedParser);

	});
};
