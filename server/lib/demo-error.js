'use strict';

const {ValidationError} = require('@rowanmanning/app');

module.exports = function demoError(message) {
	const error = new ValidationError();
	error.errors.demo = new Error(message || 'Sorry, this feature is not available in demo mode.');
	return error;
};
