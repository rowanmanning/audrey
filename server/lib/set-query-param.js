'use strict';

const {URL} = require('url');

module.exports = function setQueryParam(url, param, value) {
	const parsedUrl = new URL(url, 'https://localhost/');
	const params = parsedUrl.searchParams;
	params.set(param, value);
	params.sort();
	const query = params.toString();
	return `${parsedUrl.pathname}${query ? `?${query}` : ''}`;
};
