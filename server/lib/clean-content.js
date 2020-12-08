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
	const cleanDOM = DOMPurify.sanitize(document.body, {

		// Sanitize the DOM in-place so that we can make changes afterwards
		IN_PLACE: true,

		// Strip data attributes, they're not needed
		ALLOW_DATA_ATTR: false,

		// Allow iframes so that we can replace them with placeholders
		ADD_TAGS: ['iframe'],

		// Strip the class, height, and width attributes, these can interfere
		// with the interface styles
		FORBID_ATTR: ['class', 'height', 'width'],

		// Strip elements which might break page styling or aren't required
		// without JavaScript
		FORBID_TAGS: ['dialog', 'menu', 'slot', 'template']

	});

	// Wrap table elements for styling
	for (const table of cleanDOM.querySelectorAll('table')) {
		wrapTableElement(table);
	}

	// Replace iframe elements with links
	for (const iframe of cleanDOM.querySelectorAll('iframe')) {
		replaceIframeElement(iframe);
	}

	// Return the purified DOM
	return cleanDOM.innerHTML;
};

function htmlStringToDOM(content) {
	const {window} = new JSDOM(content);
	return {
		document: window.document,
		window
	};
}

function cleanAttributes(baseUrl, node) {

	// Handle href attributes
	if (node.hasAttribute('href')) {

		// Make href attributes absolute using base URL
		node.setAttribute('href', absoluteUrl(node.getAttribute('href'), baseUrl));

	}

	// Handle src attributes
	if (node.hasAttribute('src')) {

		// Make src attributes absolute using base URL
		node.setAttribute('src', absoluteUrl(node.getAttribute('src'), baseUrl));

	}

	// Handle srcset attributes
	if (node.hasAttribute('srcset')) {
		try {
			const sources = srcset.parse(node.getAttribute('srcset'));
			for (const source of sources) {

				// Make src attributes absolute using base URL
				source.url = absoluteUrl(source.url, baseUrl);

			}
			node.setAttribute('srcset', srcset.stringify(sources));
		} catch (error) {}
	}

}

function wrapTableElement(table) {
	table.outerHTML = `<div class="table-wrapper">${table.outerHTML}</div>`;
}

function replaceIframeElement(iframe) {
	const source = iframe.getAttribute('src');
	iframe.outerHTML = `
		<div class="unrenderable">
			The original article has a frame with interactive content in this position,
			which cannot be loaded. <a href="${source}">View the content of the iframe here</a>,
			or visit the original article to see the frame in place.
		</div>
	`;
}

function absoluteUrl(url, baseUrl) {
	if (url.startsWith('#')) {
		return url;
	}
	return new URL(url, baseUrl).toString();
}
