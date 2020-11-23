'use strict';

const FeedParser = require('feedparser');
const got = require('got');
const {Schema, ValidationError} = require('@rowanmanning/app');
const shortid = require('shortid');
const uniqueValidator = require('mongoose-unique-validator');

const day = 1000 * 60 * 60 * 24;

module.exports = function defineFeedSchema(app) {

	const feedSchema = new Schema({
		_id: {
			type: String,
			default: shortid.generate
		},
		title: {
			type: String
		},
		xmlUrl: {
			type: String,
			required: [true, 'Feed URL is required'],
			unique: true
		},
		htmlUrl: {
			type: String
		},
		author: {
			type: String
		},
		categories: [{
			type: String
		}],
		copyright: {
			type: String
		},
		generator: {
			type: String
		},
		language: {
			type: String
		},
		syncedAt: {
			type: Date
		}
	}, {
		timestamps: true,
		collation: {locale: 'en'}
	});

	// Add unique property validation
	feedSchema.plugin(uniqueValidator, {
		message: `A feed with that {PATH} already exists`
	});

	// Virtual internal feed URL
	feedSchema.virtual('url').get(function() {
		return `/feeds/${this.get('id')}`;
	});

	// When a feed is created, perform a fetch
	feedSchema.pre('save', async function(done) {
		if (this.isNew) {
			try {
				await this.sync(false);
			} catch (error) {
				done(error);
			}
		}
		done();
	});

	// Feed sync method, used for creating and refreshing feeds
	feedSchema.method('sync', async function(saveFeedChanges = true) {

		// Get the feed ID and app settings
		const feedId = this._id;
		const settings = await app.models.Settings.get();
		app.log.info(`[feeds:${feedId}]: syncing`);

		try {
			await new Promise((resolve, reject) => {

				// Request the XMl and stream the response
				const xmlStream = got.stream(this.get('xmlUrl'));
				xmlStream.on('error', reject);

				// Create a feed parser
				const feedParser = new FeedParser();
				feedParser.on('error', reject);
				feedParser.on('end', () => resolve());

				// Handle the feed meta (the information about the feed itself),
				// update the feed document to include all the newly parsed data
				feedParser.on('meta', async meta => {
					this.title = meta.title;
					this.xmlUrl = meta.xmlUrl;
					this.htmlUrl = meta.link;
					this.author = meta.author ?? this.author;
					this.categories = meta.categories ?? this.categories;
					this.copyright = meta.copyright ?? this.copyright;
					this.generator = meta.generator ?? this.generator;
					this.language = meta.language ?? this.language;
					this.syncedAt = new Date();
					if (saveFeedChanges) {
						try {
							await this.save();
						} catch (error) {
							// The save does not resolve or reject the promise,
							// so errors can't be thrown
							app.log.error(`[feeds:${feedId}]: failed to save: ${error.message}`);
						}
					}
				});

				// Handle feed entries, saving them as necessary
				feedParser.on('readable', async function() {
					const cutOffDate = new Date(Date.now() - (day * settings.daysToRetainOldPosts));
					let entry;
					while (entry = this.read()) {
						try {
							if (entry.date > cutOffDate) {
								await app.models.Entry.createOrUpdate({
									feed: feedId,
									title: entry.title,
									guid: entry.guid,
									htmlUrl: entry.origlink ?? entry.link,
									content: entry.description,
									summary: entry.summary,
									author: entry.author,
									categories: entry.categories,
									syncedAt: new Date(),
									publishedAt: entry.pubDate,
									modifiedAt: entry.date
								});
								app.log.info(`[feeds:${feedId}]: found entry ${entry.guid}`);
							} else {
								app.log.info(`[feeds:${feedId}]: entry ${entry.guid} is too old`);
							}
						} catch (error) {
							// Each entry saving does not resolve or reject the promise,
							// so errors can't be thrown
							app.log.error(`[feeds:${feedId}]: failed to save entry ${entry.guid}: ${error.message}`);
						}
					}
				});

				// Pipe the XML response into the feed parser
				xmlStream.pipe(feedParser);
			});
		} catch (caughtError) {
			app.log.error(`[feeds:${feedId}]: failed to sync: ${caughtError.message}`);

			// Handle not a feed message from node-feedparser
			if (caughtError.message === 'Not a feed') {
				const error = new ValidationError(this);
				error.errors.xmlUrl = new Error('Feed URL must be a valid ATOM or RSS feed');
				throw error;
			}

			// Handle HTTP errors
			if (caughtError.name === 'HTTPError') {
				const error = new ValidationError(this);
				error.errors.xmlUrl = new Error('Feed URL responded with an error, please check that the URL is correct');
				throw error;
			}

			throw caughtError;
		}
	});

	feedSchema.static('fetchAll', function(query) {
		return this
			.find(query)
			.sort('title');
	});

	return feedSchema;
};
