'use strict';

const cleanContent = require('../lib/clean-content');
const cleanTitle = require('../lib/clean-title');
const cleanUrl = require('../lib/clean-url');
const manifest = require('../../package.json');
const mediaType = require('../lib/media-type');
const {Schema} = require('mongoose');
const shortid = require('shortid');

module.exports = function defineEntrySchema(app) {

	const enclosureSchema = new Schema({
		_id: {
			type: String,
			default: shortid.generate
		},
		url: {
			type: String
		},
		mimeType: {
			type: String
		}
	}, {
		timestamps: false,
		collation: {locale: 'en'}
	});

	// Virtual enclosure type
	enclosureSchema.virtual('type').get(function() {
		return mediaType(this.mimeType).toString();
	});

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
			validate: [
				uniqueValidator('guid'),
				'A feed with that GUID already exists'
			],
			unique: true
		},
		htmlUrl: {
			type: String,
			set: cleanUrl
		},
		content: {
			type: String
		},
		enclosures: [enclosureSchema],
		author: {
			type: String
		},
		categories: [{
			type: String
		}],
		isRead: {
			type: Boolean,
			index: true,
			required: [true, 'Entry read status is required'],
			default: false
		},
		isBookmarked: {
			type: Boolean,
			index: true,
			required: [true, 'Entry bookmark status is required'],
			default: false
		},
		syncedAt: {
			type: Date,
			required: [true, 'Entry sync date is required']
		},
		publishedAt: {
			type: Date,
			index: true,
			required: [true, 'Entry publish date is required']
		},
		readAt: {
			type: Date,
			default: null
		},
		bookmarkedAt: {
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

	function uniqueValidator(property) {
		return async function validate(value) {
			if (this.isNew) {
				const count = await app.models.Entry.countDocuments({[property]: value});
				return !count;
			}
			return true;
		};
	}

	// Always populate the feed
	entrySchema.pre(['find', 'findOne'], function() {
		this.populate('feed');
	});

	// Virtual display title
	entrySchema.virtual('displayTitle').get(function() {
		return cleanTitle(this.title);
	});

	// Virtual internal entry URL
	entrySchema.virtual('url').get(function() {
		return `/entries/${this.get('id')}`;
	});

	// Virtual internal entry mark URL
	entrySchema.virtual('markUrl').get(function() {
		return `${this.get('url')}/mark`;
	});

	// Virtual entry external report issue URL
	entrySchema.virtual('issueUrl').get(function() {
		const issueBody = `
			There's a formatting issue for the entry [${this.title}](${this.htmlUrl}):

			PLEASE DESCRIBE THE FORMATTING ISSUE HERE


			## Debugging information
			**Audrey version:** \`${manifest.version}\`
			${this.populated('feed') ? `**Feed URL:** <${this.feed.xmlUrl}>` : ''}
		`.replace(/\t+/g, '').trim();
		return `${manifest.bugs}/new?title=Issue&labels=bug&body=${encodeURIComponent(issueBody)}`;
	});

	// Virtual clean entry content
	entrySchema.virtual('cleanContent').get(function() {
		return cleanContent({
			content: this.get('content'),
			baseUrl: this.get('htmlUrl')
		});
	});

	// Whether the entry content contains an HTML tag
	entrySchema.virtual('contentContainsHTMLTag').get(function() {
		return /<[^>]+>/i.test(this.get('content'));
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

	entrySchema.method('markAsBookmarked', function() {
		if (!this.isBookmarked) {
			this.isBookmarked = true;
			this.bookmarkedAt = new Date();
			return this.save();
		}
	});

	entrySchema.method('markAsUnbookmarked', function() {
		if (this.isBookmarked) {
			this.isBookmarked = false;
			this.bookmarkedAt = null;
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

	entrySchema.static('fetchPaginated', async function(before, count, query = {}) {
		const beforeDate = (before ? new Date(before) : null);
		const pagination = {
			before: beforeDate || null,
			items: [],
			next: null,
			perPage: count,
			totalPages: 0
		};

		// Create an item query
		if (pagination.before) {
			query.publishedAt = {$lt: pagination.before};
		}
		const items = pagination.items = await this.fetchAll(query).limit(count);

		// Add a next before value to the pagination
		pagination.next = (
			items.length === pagination.perPage ?
				items[items.length - 1].publishedAt.toISOString() :
				null
		);

		return pagination;
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

	entrySchema.static('fetchBookmarked', function() {
		return this
			.find({isBookmarked: true})
			.sort({bookmarkedAt: -1});
	});

	entrySchema.static('countBookmarked', function() {
		return this.countDocuments({isBookmarked: true});
	});

	entrySchema.static('countAllByFeedId', function(feedId) {
		return this.countDocuments({feed: feedId});
	});

	entrySchema.static('countUnreadByFeedId', function(feedId) {
		return this.countDocuments({
			feed: feedId,
			isRead: false
		});
	});

	entrySchema.static('fetchAllByFeedId', function(feedId) {
		return this.fetchAll({feed: feedId});
	});

	entrySchema.static('markAsReadByFeedId', function(feedId) {
		return this.updateMany({
			feed: feedId,
			isRead: false
		}, {
			$set: {
				isRead: true,
				readAt: new Date()
			}
		});
	});

	entrySchema.static('markAsUnreadByFeedId', function(feedId) {
		return this.updateMany({
			feed: feedId,
			isRead: true
		}, {
			$set: {
				isRead: false,
				readAt: null
			}
		});
	});

	entrySchema.static('removeOldEntries', async function() {
		const cutOffDate = await app.models.Settings.getEntryCutoffDate();
		const {deletedCount} = await this.deleteMany({
			isBookmarked: false, // Never remove bookmarked entries
			publishedAt: {$lt: cutOffDate}
		});
		return deletedCount;
	});

	entrySchema.static('performScheduledJobs', async function() {
		const removedEntries = await this.removeOldEntries();
		app.log.info({
			name: 'Scheduler',
			msg: `Removed ${removedEntries} old entries`
		});
	});

	entrySchema.static('countGroupedByFeedId', async function() {
		const counts = await this.aggregate([
			{$group: {
				_id: '$feed',
				total: {$sum: 1},
				unread: {$sum: {$cond: ['$isRead', 0, 1]}}
			}}
		]);
		return counts.reduce((result, {_id, total, unread}) => {
			result[_id] = {
				total,
				unread,
				read: total - unread
			};
			return result;
		}, {});
	});

	return entrySchema;
};
