'use strict';

const {Schema} = require('mongoose');
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
			app.log.error({
				name: 'FeedError',
				msg: `Feed errors failed to delete: ${error.message}`
			});
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
			app.log.error({
				name: 'FeedError',
				msg: `Feed error failed to throw: ${error.message}`
			});
		}
	});

	return feedErrorSchema;
};
