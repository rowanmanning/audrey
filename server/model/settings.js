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
		removeOldPosts: {
			type: Boolean,
			required: [true, 'Remove old posts setting is required'],
			default: true
		},
		daysToRetainOldPosts: {
			type: Number,
			required: [true, 'Days to retain old posts setting is required'],
			validate: [Number.isInteger, 'Days to retain old posts setting must be a whole number'],
			min: [1, 'Days to retain old posts setting must be 1 or greater'],
			default: 60
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
