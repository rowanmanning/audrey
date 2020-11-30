'use strict';

const cleanContent = require('../lib/clean-content');
const {Schema} = require('@rowanmanning/app');
const shortid = require('shortid');
const uniqueValidator = require('mongoose-unique-validator');

module.exports = function defineEntrySchema(app) {

	const entrySchema = new Schema({
		_id: {
			type: String,
			default: shortid.generate
		},
		feed: {
			type: String,
			index: true,
			required: [true, 'Entry feed ID is required'],
			ref: 'Feed'
		},
		title: {
			type: String,
			required: [true, 'Entry title required']
		},
		guid: {
			type: String,
			required: [true, 'Entry GUID is required'],
			unique: true
		},
		htmlUrl: {
			type: String
		},
		content: {
			type: String
		},
		author: {
			type: String
		},
		categories: [{
			type: String
		}],
		isRead: {
			type: Boolean,
			required: [true, 'Entry read status is required'],
			default: false
		},
		syncedAt: {
			type: Date,
			required: [true, 'Entry sync date is required']
		},
		publishedAt: {
			type: Date,
			required: [true, 'Entry publish date is required']
		},
		readAt: {
			type: Date,
			default: null
		},
		modifiedAt: {
			type: Date
		}
	}, {
		timestamps: false,
		collation: {locale: 'en'}
	});

	// Add unique property validation
	entrySchema.plugin(uniqueValidator, {
		message: `An entry with that {PATH} already exists`
	});

	// Virtual internal entry URL
	entrySchema.virtual('url').get(function() {
		return `/entries/${this.get('id')}`;
	});

	// Virtual internal entry mark URL
	entrySchema.virtual('markUrl').get(function() {
		return `/entries/${this.get('id')}/mark`;
	});

	// Virtual clean entry content
	entrySchema.virtual('cleanContent').get(function() {
		return cleanContent({
			content: this.get('content'),
			baseUrl: this.get('htmlUrl')
		});
	});

	entrySchema.method('markAsRead', function() {
		if (!this.isRead) {
			this.isRead = true;
			this.readAt = new Date();
			return this.save();
		}
	});

	entrySchema.method('markAsUnread', function() {
		if (this.isRead) {
			this.isRead = false;
			this.readAt = null;
			return this.save();
		}
	});

	entrySchema.static('createOrUpdate', function(entry) {
		const query = {
			guid: entry.guid
		};
		return this.findOneAndUpdate(query, entry, {
			context: 'query',
			new: true,
			runValidators: true,
			setDefaultsOnInsert: true,
			upsert: true
		});
	});

	entrySchema.static('fetchAll', function(query) {
		return this
			.find(query)
			.sort({publishedAt: -1});
	});

	entrySchema.static('countAll', function() {
		return this.countDocuments();
	});

	entrySchema.static('fetchUnread', function() {
		return this.fetchAll({isRead: false});
	});

	entrySchema.static('countUnread', function() {
		return this.countDocuments({isRead: false});
	});

	entrySchema.static('countAllByFeedId', function(feedId) {
		return this.countDocuments({feed: feedId});
	});

	entrySchema.static('fetchAllByFeedId', function(feedId) {
		return this.fetchAll({feed: feedId});
	});

	entrySchema.static('removeOldEntries', async function() {
		const cutOffDate = await app.models.Settings.getEntryCutoffDate();
		const {deletedCount} = await this.deleteMany({
			publishedAt: {$lt: cutOffDate}
		});
		return deletedCount;
	});

	entrySchema.static('performScheduledJobs', async function() {
		const removedEntries = await this.removeOldEntries();
		app.log.info(`[scheduler:entries]: removed ${removedEntries} old entries`);
	});

	return entrySchema;
};
