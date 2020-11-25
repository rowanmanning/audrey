'use strict';

const fetchFeed = require('./fetch');

module.exports = function fetchFeedInfo(url) {
	return new Promise((resolve, reject) => {
		fetchFeed(url)
			.on('error', reject)
			.on('info', resolve);
	});
};
