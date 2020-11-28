'use strict';

const {Schema} = require('@rowanmanning/app');
const shortid = require('shortid');

const day = 1000 * 60 * 60 * 24;

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
		},
		showHelpText: {
			type: Boolean,
			required: [true, 'Show help text setting is required'],
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

	settingsSchema.static('getEntryCutoffDate', async function() {
		const {daysToRetainOldEntries} = await this.get();
		return new Date(Date.now() - (day * daysToRetainOldEntries));
	});

	return settingsSchema;
};
