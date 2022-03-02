'use strict';

const {assert} = require('chai');
const feeds = require('./feeds.json');
const getUserAgent = require('../../server/lib/user-agent');
const getLoginCookie = require('../integration/helper/get-login-cookie');
const got = require('got');
const {mkdir, stat, writeFile} = require('fs').promises;
const nock = require('nock');
const request = require('../integration/helper/request');
const seedDatabase = require('../integration/helper/seed-database');

// Lean on the integration test setup
require('../integration/setup.test');

const cachePath = `${__dirname}/cache`;
// Create the cache directory
before(async () => {
	try {
		await mkdir(cachePath);
	} catch (error) {
		if (error.code !== 'EEXIST') {
			throw error;
		}
	}
});

// Loop over feeds and create a test for each
for (const feed of feeds) {
	describe(feed, () => {
		const feedSlug = feed.replace(/[^a-z0-9.]+/gi, '-');
		const feedCachePath = `${cachePath}/${feedSlug}`;

		// Before testing the feed, check whether we have
		// a cached copy of the XMl locally. If not, then
		// we load and save it
		before(async () => {
			try {
				await stat(feedCachePath);
				console.log('    - Feed XML found in cache');
			} catch (error) {
				console.log('    - Feed XML not found in cache, fetching now');
				const {body} = await got(feed, {
					headers: {
						'User-Agent': getUserAgent()
					}
				});
				await writeFile(feedCachePath, body);
				console.log('    - cache written');
			}

			// Set up a mock version of the feed
			nock('http://real-feeds.com/')
				.persist()
				.get(`/${feedSlug}`)
				.replyWithFile(200, feedCachePath, {
					'Content-Type': 'application/json'
				});
			console.log('    - Mock feed URL set up');

			// Seed the database
			await seedDatabase(['settings']);
		});

		it('can be subscribed to in Audrey', async () => {
			console.log('    - Subscribing in Audrey');
			const response = await request('POST', '/subscribe', {
				headers: {
					cookie: await getLoginCookie('password')
				},
				form: {
					xmlUrl: `http://real-feeds.com/${feedSlug}`
				}
			});

			// If the subscribe does not respond with a redirect,
			// something went wrong. Investigate
			if (response.statusCode !== 302) {
				const {document} = response.dom();
				const errors = document.querySelectorAll('[data-test=form-error]');
				assert.lengthOf(errors, 1);
				throw new Error(errors[0].textContent);
			}
		});

	});
}
