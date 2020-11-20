'use strict';

const {Schema} = require('@rowanmanning/app');

/**
 * Define a Session schema to be used as a model.
 * This is mostly here to allow tests to easily access session data.
 *
 * @param {module:@rowanmanning/app~App} app
 *     The application to mount routes on.
 * @returns {module:mongoose~Schema}
 *     Returns a new Mongoose schema representing a session.
 */
module.exports = function defineSessionSchema() {
	return new Schema({
		expires: {
			type: Date
		},
		session: {
			type: String,
			get: value => JSON.parse(value),
			set: value => JSON.stringify(value)
		}
	}, {timestamps: false});
};
