'use strict';

const cleanContent = require('../lib/clean-content');
const {readFile} = require('fs').promises;
const render = require('../middleware/render');

module.exports = function mountEntriesTestController(app) {
	const {router} = app;

	router.get('/entries/test', [
		fetchTestEntry,
		render('page/entries/view')
	]);

	async function fetchTestEntry(request, response, next) {
		try {
			const content = await readFile(`${__dirname}/../../data/test-entry.html`, 'utf-8');
			request.entry = response.locals.entry = {
				feed: {
					displayTitle: 'Test Feed',
					url: '/feeds',
					xmlUrl: '/feeds'
				},
				syncedAt: new Date(),
				title: 'Test Entry',
				guid: 'test',
				htmlUrl: '/entries/test',
				content,
				cleanContent: cleanContent({
					content,
					baseUrl: 'https://example.com/'
				}),
				author: 'Test Author',
				categories: [],
				publishedAt: new Date(Date.now() - (1000 * 60 * 60 * 24)),
				modifiedAt: new Date(Date.now() - (1000 * 60 * 60 * 24))
			};
			next();
		} catch (error) {
			next(error);
		}
	}

};
