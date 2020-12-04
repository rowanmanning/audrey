'use strict';

const request = require('./request');

module.exports = async function getLoginCookie(password) {
	const response = await request('POST', '/login', {form: {password}});
	if (response.headers['set-cookie']) {
		return response.headers['set-cookie'][0];
	}
	throw new Error('Login failed');
};
