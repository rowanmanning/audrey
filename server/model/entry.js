'use strict';

const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const {Schema} = require('@rowanmanning/app');
const shortid = require('shortid');
const uniqueValidator = require('mongoose-unique-validator');


module.exports = function defineEntrySchema() {

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
		summary: {
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

	// Virtual clean entry content
	entrySchema.virtual('cleanContent').get(function() {
		const window = new JSDOM('').window;
		const DOMPurify = createDOMPurify(window);
		return DOMPurify.sanitize(this.get('content'));
	});

	entrySchema.method('markAsRead', function() {
		if (!this.isRead) {
			return this.update({$set: {
				isRead: true,
				readAt: new Date()
			}});
		}
	});

	entrySchema.static('createOrUpdate', function(entry) {
		const query = {
			guid: entry.guid
		};
		return this.findOneAndUpdate(query, entry, {
			upsert: true,
			new: true,
			setDefaultsOnInsert: true
		});
	});

	entrySchema.static('fetchAll', function(query) {
		return this
			.find(query)
			.sort({publishedAt: -1})
			.populate('feed');
	});

	entrySchema.static('fetchAllUnread', function() {
		return this.fetchAll({isRead: false});
	});

	entrySchema.static('fetchAllByFeedId', function(feedId) {
		return this.fetchAll({feed: feedId});
	});

	return entrySchema;
};
