'use strict';

const FeedParser = require('feedparser');
const got = require('got');
const {Schema} = require('@rowanmanning/app');
const shortid = require('shortid');
const uniqueValidator = require('mongoose-unique-validator');

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
			required: true,
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
			await this.sync();
		}
		done();
	});

	feedSchema.method('sync', function() {
		return new Promise((resolve, reject) => {
			const feedId = this._id;
			app.log.info(`[feeds:${feedId}]: syncing`);
			got.stream(this.get('xmlUrl'))
				.on('error', reject)
				.pipe(new FeedParser())
				.on('error', reject)
				.on('end', () => resolve())
				.on('meta', meta => {
					this.title = meta.title;
					this.xmlUrl = meta.xmlUrl;
					this.htmlUrl = meta.link;
					this.author = meta.author ?? this.author;
					this.categories = meta.categories ?? this.categories;
					this.copyright = meta.copyright ?? this.copyright;
					this.generator = meta.generator ?? this.generator;
					this.language = meta.language ?? this.language;
					this.syncedAt = new Date();
				})
				.on('readable', async function() {
					let entry;
					while (entry = this.read()) {
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
					}
				});
		});
	});

	feedSchema.static('fetchAll', function(query) {
		return this
			.find(query)
			.sort('title');
	});

	return feedSchema;
};
