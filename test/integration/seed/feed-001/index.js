'use strict';

// Feed 01 is intended to test a variety of different entries,
// with as few actual entries in the database as possible

const oneDay = 1000 * 60 * 60 * 24;

module.exports = async function seedDatabase(models) {
	const {Entry, Feed} = models;

	// Create test feeds
	await Promise.all([

		// Feed 001
		Feed.create({
			_id: 'feed001',
			title: 'Mock Feed 001',
			guid: 'http://mock.feeds/001/',
			htmlUrl: 'http://mock.feeds/001/',
			xmlUrl: 'http://mock.feeds/001/feed.xml',
			publishedAt: new Date(Date.now() - oneDay),
			modifiedAt: new Date(Date.now() - oneDay)
		})

	]);

	function createEntry(number = 0, dateMod = 0, entry = {}) {
		return Entry.create(Object.assign({
			_id: `feed001-entry${number}`,
			feed: 'feed001',
			title: `Mock Feed 001 - Entry ${number}`,
			guid: `http://mock.feeds/001/entry-${number}`,
			htmlUrl: `http://mock.feeds/001/entry-${number}`,
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
	await Promise.all([
		createEntry(1, -(oneDay * 3)),
		createEntry(2, -(oneDay * 2)),
		createEntry(3, -(oneDay), {isRead: true})
	]);

};
