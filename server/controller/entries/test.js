'use strict';

const cleanContent = require('../../lib/clean-content');
const {readFile} = require('fs').promises;
const render = require('@rowanmanning/response-render-middleware');
const requireAuth = require('../../middleware/require-auth');

module.exports = function mountEntriesTestController(app) {

	app.get('/entries/test', [
		requireAuth(),
		fetchTestEntry,
		render('page/entries/view')
	]);

	async function fetchTestEntry(request, response, next) {
		try {
			const content = await readFile(`${__dirname}/../../../data/test-entry.html`, 'utf-8');
			request.entry = response.locals.entry = {
				feed: {
					displayTitle: 'Test Feed',
					url: '/feeds',
					xmlUrl: '/feeds'
				},
				syncedAt: new Date(),
				title: 'Test Entry',
				displayTitle: 'Test Entry',
				guid: 'test',
				htmlUrl: '/entries/test',
				content,
				cleanContent: cleanContent({
					content,
					baseUrl: 'https://example.com/'
				}),
				contentContainsHTMLTag: true,
				author: 'Test Author',
				categories: [],
				publishedAt: new Date(Date.now() - (1000 * 60 * 60 * 24)),
				modifiedAt: new Date(Date.now() - (1000 * 60 * 60 * 24)),
				enclosures: [
					{
						type: 'image',
						url: 'http://placekitten.com/1200/640'
					},
					{
						type: 'video',
						url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
					},
					{
						type: 'audio',
						url: 'https://chee.snoot.club/music/raw/blast-process.mp3'
					}
				]
			};
			next();
		} catch (error) {
			next(error);
		}
	}

};
