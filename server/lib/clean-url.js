'use strict';

const schemeRegExp = /^[a-z]+:\/\//;

// Sanitize a URL (mostly make sure it has a scheme)
module.exports = function cleanUrl(url) {
	if (!schemeRegExp.test(url)) {
		return `http://${url}`;
	}
	return url;
};
