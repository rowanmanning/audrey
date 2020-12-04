'use strict';

module.exports = function getFeedUrl(feedPath) {

	// The port is random so we have to get it from the app
	const port = global.app.server.address().port;

	return `http://localhost:${port}/mock-feeds/${feedPath}`;
};
