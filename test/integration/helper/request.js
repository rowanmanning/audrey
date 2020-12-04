'use strict';

const got = require('got');
const {JSDOM} = require('jsdom');

module.exports = async function request(method, path, options = {}) {

	// The port is random so we have to get it from the app
	const port = global.app.server.address().port;

	// Build the request URL
	let url = `http://localhost:${port}${path}`;
	if (/^https?:\/\//.test(path)) {
		url = path;
	}

	// Define default request options
	options = Object.assign({
		followRedirect: false,
		method,
		throwHttpErrors: false
	}, options);

	// Make the request
	const response = await got(url, options);

	// Allow getting the response body as a DOM
	response.dom = () => {
		if (!response._dom) {
			response._dom = new JSDOM(response.body).window;
		}
		return response._dom;
	};

	return response;
};
