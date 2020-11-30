'use strict';

const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const srcset = require('srcset');

module.exports = function cleanContent({content, baseUrl}) {
	const {window, document} = htmlStringToDOM(content);
	const DOMPurify = createDOMPurify(window);

	// Add a hook to clean attributes
	DOMPurify.addHook('afterSanitizeAttributes', cleanAttributes.bind(null, baseUrl));

	// Sanitize the created DOM
	return DOMPurify.sanitize(document.body.innerHTML, {

		// Strip data attributes, they're not needed
		ALLOW_DATA_ATTR: false,

		// Strip the class attribute, this can interfere with the interface styles
		FORBID_ATTR: ['class']

	});
};

function htmlStringToDOM(content) {
	const {window} = new JSDOM(content);
	return {
		document: window.document,
		window
	};
}

function cleanAttributes(baseUrl, node) {

	// Check if this is an image
	const isImage = (
		node.tagName === 'IMG' ||
		(
			node.tagName === 'SOURCE' &&
			node.parentElement &&
			node.parentElement.tagName === 'PICTURE'
		)
	);

	// Handle href attributes
	if (node.hasAttribute('href')) {

		// Make href attributes absolute using base URL
		node.setAttribute('href', absoluteUrl(node.getAttribute('href'), baseUrl));

	}

	// Handle src attributes
	if (node.hasAttribute('src')) {

		// Make src attributes absolute using base URL
		node.setAttribute('src', absoluteUrl(node.getAttribute('src'), baseUrl));

		// Proxy image requests to avoid cross-origin issues
		if (isImage) {
			node.setAttribute('src', proxyImageUrl(node.getAttribute('src')));
		}

	}

	// Handle srcset attributes
	if (node.hasAttribute('srcset')) {
		try {
			const sources = srcset.parse(node.getAttribute('srcset'));
			for (const source of sources) {

				// Make src attributes absolute using base URL
				source.url = absoluteUrl(source.url, baseUrl);

				// Proxy image requests to avoid cross-origin issues
				if (isImage) {
					source.url = proxyImageUrl(source.url);
				}

			}
			node.setAttribute('srcset', srcset.stringify(sources));
		} catch (error) {}
	}

}

function absoluteUrl(url, baseUrl) {
	if (url.startsWith('#')) {
		return url;
	}
	return new URL(url, baseUrl).toString();
}

function proxyImageUrl(url) {
	return `/proxy-image/${encodeURIComponent(url)}`;
}
