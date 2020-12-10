'use strict';

const addDays = require('date-fns/addDays');

// Feed 02 is intended to flood the site with many unread entries

module.exports = async function seedDatabase(models) {
	const {Entry, Feed} = models;

	const publishDate = addDays(new Date('2020-01-01T00:00:00Z'), 100);

	// Create test feeds
	await Promise.all([

		// Feed 002
		Feed.create({
			_id: 'feed002',
			title: 'Mock Feed 002',
			htmlUrl: 'http://mock-feeds.com/valid/002/',
			xmlUrl: 'http://mock-feeds.com/valid/002/feed.xml',
			publishedAt: publishDate,
			modifiedAt: publishDate
		})

	]);

	function createEntry(number, days, entry = {}) {
		return Entry.create(Object.assign({
			_id: `feed002-entry${number}`,
			feed: 'feed002',
			title: `Mock Feed 002 - Entry ${number}`,
			guid: `http://mock-feeds.com/valid/002/entry-${number}`,
			htmlUrl: `http://mock-feeds.com/valid/002/entry-id-${number}`,
			content: `<p>Entry ${number} Content</p>`,
			author: `Mock Feed ${number} Author`,
			isRead: false,
			isBookmarked: false,
			publishedAt: addDays(publishDate, days),
			modifiedAt: addDays(publishDate, days),
			syncedAt: new Date()
		}, entry));
	}

	// Create test entries
	await Promise.all(Object.keys(Array(100).fill(0)).reverse().map((key, index) => {
		return createEntry(index + 1, -key);
	}));

};
