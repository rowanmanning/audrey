'use strict';

// Feed 04 is intended to have a fully fleshed out entry

const {readFile} = require('fs').promises;

module.exports = async function seedDatabase(models) {
	const {Entry, Feed} = models;

	// Create test feeds
	await Promise.all([

		// Feed 004
		Feed.create({
			_id: 'feed004',
			title: 'Mock Feed 004',
			htmlUrl: 'https://example.com/',
			xmlUrl: 'https://example.com/feed.xml',
			publishedAt: new Date('2020-01-01T00:00:00Z'),
			modifiedAt: new Date('2020-01-01T00:00:00Z')
		})

	]);

	function createEntry(number, date, entry = {}) {
		return Entry.create(Object.assign({
			_id: `feed004-entry${number}`,
			feed: 'feed004',
			title: `Mock Feed 004 - Entry ${number}`,
			guid: `https://example.com/entry-id-${number}`,
			htmlUrl: `https://example.com/entry-${number}`,
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
	await createEntry(1, new Date('2020-01-01T00:00:00Z'), {
		content: await readFile(`${__dirname}/../../../../data/test-entry.html`, 'utf-8'),
		enclosures: [
			{
				mimeType: 'image/jpeg',
				url: 'https://example.com/image.jpg'
			},
			{
				mimeType: 'audio/mpeg',
				url: 'https://example.com/audio.mp3'
			},
			{
				mimeType: 'video/mp4',
				url: 'https://example.com/video.mp4'
			},
			{
				mimeType: 'text/html',
				url: 'https://example.com/'
			}
		]
	});

};
