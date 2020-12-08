'use strict';

const cleanTitle = require('../lib/clean-title');
const cleanUrl = require('../lib/clean-url');
const fetchFeed = require('@rowanmanning/fetch-feed');
const {Schema, ValidationError} = require('@rowanmanning/app');
const shortid = require('shortid');
const uniqueValidator = require('mongoose-unique-validator');
const userAgent = require('../lib/user-agent');

module.exports = function defineFeedSchema(app) {
	const feedRefreshFlags = {
		inProgress: false
	};

	const feedSchema = new Schema({
		_id: {
			type: String,
			default: shortid.generate
		},
		title: {
			type: String
		},
		customTitle: {
			type: String
		},
		xmlUrl: {
			type: String,
			required: [true, 'Feed URL is required'],
			unique: true,
			index: true,
			set: cleanUrl
		},
		htmlUrl: {
			type: String,
			set: cleanUrl
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

	// Virtual display title
	feedSchema.virtual('displayTitle').get(function() {
		return cleanTitle(this.customTitle || this.title);
	});

	// Virtual internal feed URL
	feedSchema.virtual('url').get(function() {
		return `/feeds/${this.get('id')}`;
	});

	// Virtual internal feed refresh URL
	feedSchema.virtual('refreshUrl').get(function() {
		return `${this.get('url')}/refresh`;
	});

	// Virtual internal feed unsubscribe URL
	feedSchema.virtual('unsubscribeUrl').get(function() {
		return `${this.get('url')}/unsubscribe`;
	});

	// Virtual internal feed settings URL
	feedSchema.virtual('settingsUrl').get(function() {
		return `${this.get('url')}/settings`;
	});

	// Virtual internal feed mark URL
	feedSchema.virtual('markUrl').get(function() {
		return `${this.get('url')}/mark`;
	});

	// Virtual to populate feed errors
	feedSchema.virtual('errors', {
		ref: 'FeedError',
		localField: '_id',
		foreignField: 'feed',
		justOne: false
	});

	// Virtual to populate feed entries
	feedSchema.virtual('entries', {
		ref: 'Entry',
		localField: '_id',
		foreignField: 'feed',
		justOne: false
	});

	// Feed refresh method, used to refresh feed information and load entries
	feedSchema.method('refresh', async function() {

		// Get the feed ID and cut-off date
		const feedId = this._id;
		const cutOffDate = await app.models.Settings.getEntryCutoffDate();
		await app.models.FeedError.deleteAllByFeedId(feedId);

		async function throwFeedError(error) {
			const validationError = app.models.Feed._feedErrorToValidationError(error);
			let errorMessage = validationError.message;
			const validationMessages = Object.values(validationError.errors);
			if (validationMessages.length) {
				errorMessage = validationMessages.map(({message}) => message).join(', ');
			}
			await app.models.FeedError.throw(feedId, errorMessage);
		}

		// Fetch the feed
		try {
			app.log.info(`[feeds:${feedId}]: starting refresh`);
			await fetchFeed({

				// Pass in the feed URL and request options
				url: this.xmlUrl,
				requestOptions: {
					headers: {
						'User-Agent': userAgent()
					}
				},

				onInfo: async info => {
					try {
						const infoArray = Object.entries(app.models.Feed._transformFeedInfo(info));
						for (const [property, value] of infoArray) {
							this[property] = value;
						}
						this.syncedAt = new Date();
						await this.save();
						app.log.info(`[feeds:${feedId}]: feed info refreshed`);
					} catch (error) {
						app.log.error(`[feeds:${feedId}]: failed to save: ${error.message}`);
						await throwFeedError(error);
					}
				},

				onEntry: async entry => {
					try {
						if (entry.date > cutOffDate) {
							await app.models.Entry.createOrUpdate({
								feed: feedId,
								syncedAt: new Date(),
								...app.models.Feed._transformFeedEntry(entry)
							});
							app.log.info(`[feeds:${feedId}]: found entry ${entry.guid}`);
						} else {
							app.log.info(`[feeds:${feedId}]: entry ${entry.guid} is too old`);
						}
					} catch (error) {
						app.log.error(`[feeds:${feedId}]: failed to save entry ${entry.guid}: ${error.message}`);
						await throwFeedError(error);
					}
				}

			});
			app.log.info(`[feeds:${feedId}]: refresh complete`);
		} catch (error) {
			app.log.error(`[feeds:${feedId}]: failed to load: ${error.message}`);
			await throwFeedError(error);
		}
	});

	// Feed unsubscribe method, used for deleting a feed
	feedSchema.method('unsubscribe', async function() {
		await app.models.FeedError.deleteAllByFeedId(this._id);
		await app.models.Entry.deleteMany({
			feed: this._id
		});
		await app.models.Feed.deleteOne({
			_id: this._id
		});
	});

	feedSchema.method('isRead', async function() {
		return (await app.models.Entry.countUnreadByFeedId(this._id)) === 0;
	});

	// Fetch all feeds
	feedSchema.static('fetchAll', function(query) {
		return this
			.find(query)
			.sort({
				customTitle: 1,
				title: 1
			});
	});

	feedSchema.static('countAll', function() {
		return this.countDocuments();
	});

	// Refresh all feeds
	feedSchema.static('refreshAll', async function() {

		// Return if we're already refreshing feeds
		if (feedRefreshFlags.inProgress) {
			return;
		}

		feedRefreshFlags.inProgress = true;
		try {
			const feeds = await this.fetchAll();
			for (const feed of feeds) {
				try {
					await feed.refresh();
				} catch (error) {
					app.log.error(`[feeds:${feed._id}]: error refreshing: ${error.message}`);
				}
			}
		} catch (error) {
			app.log.error(`[feeds]: error loading feeds: ${error.message}`);
		}
		feedRefreshFlags.inProgress = false;

	});

	feedSchema.static('isRefreshInProgress', () => {
		return feedRefreshFlags.inProgress;
	});

	feedSchema.static('performScheduledJobs', async function() {
		app.log.info(`[scheduler:feeds]: refreshing all feeds`);
		await this.refreshAll();
	});

	// Subscribe to a feed, first validating that it hasn't been added already
	feedSchema.static('subscribe', async function(xmlUrl) {
		try {
			// TODO remove the need for the double fetch on subscribe
			let feedInfo;
			await fetchFeed({
				url: xmlUrl,
				requestOptions: {
					headers: {
						'User-Agent': userAgent()
					}
				},
				onInfo(info) {
					feedInfo = info;
				}
			});
			const feed = await this.create({
				xmlUrl: feedInfo.xmlUrl || xmlUrl,
				...this._transformFeedInfo(feedInfo)
			});
			app.log.info(`[feeds:${feed._id}]: subscribed`);
			return feed;
		} catch (error) {
			throw this._feedErrorToValidationError(error);
		}
	});

	// Normalize feed info into an object which can be inserted
	feedSchema.static('_transformFeedInfo', feedInfo => {
		return {
			author: feedInfo.author,
			categories: feedInfo.categories,
			copyright: feedInfo.copyright,
			generator: feedInfo.generator,
			htmlUrl: feedInfo.link,
			language: feedInfo.language,
			title: feedInfo.title
		};
	});

	// Normalize feed entry into an object which can be inserted
	feedSchema.static('_transformFeedEntry', feedEntry => {
		return {
			title: feedEntry.title,
			guid: feedEntry.guid,
			htmlUrl: feedEntry.origlink || feedEntry.link,
			content: feedEntry.description,
			enclosures: feedEntry.enclosures.map(enclosure => ({
				url: enclosure.url,
				mimeType: enclosure.type
			})),
			author: feedEntry.author,
			categories: feedEntry.categories,
			publishedAt: feedEntry.pubDate,
			modifiedAt: feedEntry.date
		};
	});

	// Handle errors from the feed parser
	feedSchema.static('_feedErrorToValidationError', error => {
		if (error instanceof ValidationError) {
			return error;
		}

		const validationError = new ValidationError();
		validationError.errors.xmlUrl = new Error(
			`The feed could not be parsed: ${error.message}`
		);

		// Handle not a feed message from node-feedparser
		if (error.message === 'Not a feed') {
			validationError.errors.xmlUrl = new Error(
				'Feed URL is not a valid ATOM or RSS feed'
			);
		}

		// Handle HTTP errors
		if (error.name === 'HTTPError') {
			validationError.errors.xmlUrl = new Error(
				'Feed URL responded with an error status'
			);
		}

		return validationError;
	});

	return feedSchema;
};
