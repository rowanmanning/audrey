'use strict';

const manifest = require('../../package.json');

// Get the Audrey useragent
module.exports = function userAgent() {
	return `Audrey/${manifest.version}`;
};
