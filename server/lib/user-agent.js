'use strict';

const manifest = require('../../package.json');
const gotManifest = require('got/package.json');

// Get the Audrey useragent
module.exports = function userAgent() {
	return `Audrey/${manifest.version} (+${manifest.homepage}) (Got/${gotManifest.version})`;
};
