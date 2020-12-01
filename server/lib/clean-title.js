'use strict';

const {JSDOM} = require('jsdom');

// Remove all HTML from the title
module.exports = function cleanTitle(title) {
	const {window} = new JSDOM(title);
	return window.document.body.textContent;
};
