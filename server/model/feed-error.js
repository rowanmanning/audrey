'use strict';

const {Schema} = require('@rowanmanning/app');
const shortid = require('shortid');

module.exports = function defineFeedErrorSchema(app) {

	const feedErrorSchema = new Schema({
		_id: {
			type: String,
			default: shortid.generate
		},
		feed: {
			type: String,
			index: true,
			unique: false,
			required: [true, 'Feed error feed ID is required'],
			ref: 'Feed'
		},
		message: {
			type: String,
			required: [true, 'FeedError message is required']
		}
	}, {
		timestamps: true,
		collation: {locale: 'en'}
	});

	// Always populate the feed
	feedErrorSchema.pre('find', function() {
		this.populate('feed');
	});

	feedErrorSchema.static('deleteAllByFeedId', async function(feedId) {
		try {
			await this.deleteMany({
				feed: feedId
			});
		} catch (error) {
			app.log.error(`[feed-error]: feed errors failed to delete: ${error.message}`);
		}
	});

	feedErrorSchema.static('throw', async function(feed, message) {
		try {
			const feedError = await this.create({
				feed,
				message
			});
			return feedError;
		} catch (error) {
			app.log.error(`[feed-error]: feed error failed to throw: ${error.message}`);
		}
	});

	feedErrorSchema.static('fetchFiltered', function(filters = {}) {
		const query = {};

		// Filter based on read status
		switch (filters.status) {
			case 'all':
				break;
			case 'read':
				query.isRead = true;
				break;
			default:
				query.isRead = false;
		}

		return this.fetchAll(query);
	});

	feedErrorSchema.static('fetchAll', function(query) {
		return this
			.find(query)
			.sort({createdAt: -1});
	});

	feedErrorSchema.static('fetchAllByFeedId', function(feedId) {
		return this.fetchAll({feed: feedId});
	});

	return feedErrorSchema;
};
