'use strict';

const {Schema} = require('@rowanmanning/app');
const shortid = require('shortid');
const settings = require('../controller/settings');

module.exports = function defineSettingsSchema(app) {

	const settingsSchema = new Schema({
		_id: {
			type: String,
			default: shortid.generate
		},
		siteTitle: {
			type: String,
			required: [true, 'Site title setting is required'],
			maxlength: [20, 'Site title setting must be between 3 and 20 characters in length'],
			minlength: [3, 'Site title setting must be between 3 and 20 characters in length'],
			default: app.name
		},
		removeOldEntries: {
			type: Boolean,
			required: [true, 'Remove old entries setting is required'],
			default: true
		},
		daysToRetainOldEntries: {
			type: Number,
			required: [true, 'Days to retain old entries setting is required'],
			validate: [Number.isInteger, 'Days to retain old entries setting must be a whole number'],
			min: [1, 'Days to retain old entries setting must be 1 or greater'],
			default: 60
		},
		autoMarkAsRead: {
			type: Boolean,
			required: [true, 'Auto mark as read setting is required'],
			default: true
		}
	}, {
		timestamps: true,
		collation: {locale: 'en'}
	});

	settingsSchema.static('get', async function() {
		const result = await this.findOne();
		if (result) {
			return result;
		}
		return this.create({});
	});

	return settingsSchema;
};
