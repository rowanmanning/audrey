'use strict';

module.exports = function proxyImageUrl(url) {
	return `/proxy-image/${encodeURIComponent(url)}`;
};
