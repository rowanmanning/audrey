'use strict';

// Feed 02 is intended to flood the site with many unread entries

const oneDay = 1000 * 60 * 60 * 24;

module.exports = async function seedDatabase(models) {
	const {Entry, Feed} = models;

	// Create test feeds
	await Promise.all([

		// Feed 002
		Feed.create({
			_id: 'feed002',
			title: 'Mock Feed 002',
			htmlUrl: 'http://mock-feeds.com/valid/002/',
			xmlUrl: 'http://mock-feeds.com/valid/002/feed.xml',
			publishedAt: new Date(Date.now() - oneDay),
			modifiedAt: new Date(Date.now() - oneDay)
		})

	]);

	function createEntry(number = 0, dateMod = 0, entry = {}) {
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
			publishedAt: new Date(Date.now() + dateMod),
			modifiedAt: new Date(Date.now() + dateMod),
			syncedAt: new Date()
		}, entry));
	}

	// Create test entries
	await Promise.all(Object.keys(Array(100).fill(0)).reverse().map((key, index) => {
		return createEntry(index + 1, -(oneDay * (key + 10)));
	}));

};
