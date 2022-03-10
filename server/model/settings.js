'use strict';

const {Schema} = require('mongoose');
const shortid = require('shortid');
const {comparePasswordToHash, hashPassword} = require('../lib/crypto/password');

const day = 1000 * 60 * 60 * 24;

module.exports = function defineSettingsSchema() {

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
			set: value => (typeof value === 'string' ? value.trim() : null),
			default: 'Audrey'
		},
		removeOldEntries: {
			type: Boolean,
			required: [true, 'Remove old entries setting is required'],
			default: true
		},
		daysToRetainOldEntries: {
			type: Number,
			required: [true, 'Days to retain old entries setting is required'],
			validate: [
				Number.isInteger,
				'Days to retain old entries setting must be a whole number'
			],
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
		},
		passwordHash: {
			type: String,
			minlength: [8, 'Password must be 8 or more characters in length']
		}
	}, {
		timestamps: true,
		collation: {locale: 'en'}
	});

	settingsSchema.pre('save', async function() {
		if (this.isModified('passwordHash')) {
			this.passwordHash = await hashPassword(this.passwordHash);
		}
	});

	settingsSchema.method('hasPassword', function() {
		return Boolean(this.passwordHash);
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

	settingsSchema.static('setPassword', async function(plainTextPassword) {
		const settings = await this.get();
		settings.passwordHash = plainTextPassword;
		return settings.save();
	});

	settingsSchema.static('checkPassword', async function(plainTextPassword) {
		const settings = await this.get();
		if (!settings.passwordHash) {
			return false;
		}
		return comparePasswordToHash(plainTextPassword, settings.passwordHash);
	});

	return settingsSchema;
};
