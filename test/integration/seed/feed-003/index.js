'use strict';

// Feed 03 is intended to be empty

module.exports = async function seedDatabase(models) {
	const {Feed} = models;

	// Create test feeds
	await Promise.all([

		// Feed 003
		Feed.create({
			_id: 'feed003',
			title: 'Mock Feed 003',
			htmlUrl: 'http://mock-feeds.com/valid/003/',
			xmlUrl: 'http://mock-feeds.com/valid/003/feed.xml',
			publishedAt: new Date('2020-01-01T00:00:00Z'),
			modifiedAt: new Date('2020-01-01T00:00:00Z')
		})

	]);

};
