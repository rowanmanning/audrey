'use strict';

const App = require('@rowanmanning/app');
const uuid = require('uuid');

module.exports = class AudreyApp extends App {

	constructor(options = {}) {
		options.name = 'Audrey';
		options.databaseUrl = options.databaseUrl ?? 'mongodb://localhost:27017/audrey';
		options.sessionSecret = options.sessionSecret ?? uuid.v4();
		super(options);
	}

};
