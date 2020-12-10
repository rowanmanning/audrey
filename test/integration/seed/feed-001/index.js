'use strict';

// Feed 01 is intended to test a variety of different entries,
// with as few actual entries in the database as possible

module.exports = async function seedDatabase(models) {
	const {Entry, Feed} = models;

	// Create test feeds
	await Promise.all([

		// Feed 001
		Feed.create({
			_id: 'feed001',
			title: 'Mock Feed 001',
			htmlUrl: 'http://mock-feeds.com/valid/001/',
			xmlUrl: 'http://mock-feeds.com/valid/001/feed.xml',
			publishedAt: new Date('2020-01-03T00:00:00Z'),
			modifiedAt: new Date('2020-01-03T00:00:00Z')
		})

	]);

	function createEntry(number, date, entry = {}) {
		return Entry.create(Object.assign({
			_id: `feed001-entry${number}`,
			feed: 'feed001',
			title: `Mock Feed 001 - Entry ${number}`,
			guid: `http://mock-feeds.com/valid/001/entry-id-${number}`,
			htmlUrl: `http://mock-feeds.com/valid/001/entry-${number}`,
			content: `<p>Entry ${number} Content</p>`,
			author: `Mock Feed ${number} Author`,
			isRead: false,
			isBookmarked: false,
			publishedAt: date,
			modifiedAt: date,
			syncedAt: new Date('2020-01-04T00:00:00Z')
		}, entry));
	}

	// Create test entries
	await Promise.all([
		createEntry(1, new Date('2020-01-01T00:00:00Z')),
		createEntry(2, new Date('2020-01-02T00:00:00Z'), {isBookmarked: true}),
		createEntry(3, new Date('2020-01-03T00:00:00Z'), {isRead: true})
	]);

};
