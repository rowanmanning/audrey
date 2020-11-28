'use strict';

const got = require('got');

module.exports = function mountProxyImageController(app) {
	const {router} = app;

	router.get('/proxy-image/:image', proxyImage);

	function proxyImage(request, response, next) {
		const imageRequest = got.stream(request.params.image);

		// Proxy if the response is an image
		imageRequest.on('response', httpResponse => {
			if (isImageResponse(httpResponse)) {
				return imageRequest.pipe(response);
			}
			return next(new Error('Proxy URL did not respond with an image'));
		});

		// Handle errors
		imageRequest.on('error', next);
	}

	function isImageResponse(httpResponse) {
		switch (httpResponse.headers['content-type']) {
			case 'image/gif':
			case 'image/jpeg':
			case 'image/png':
			case 'image/webp':
			case 'image/avif':
				return true;
			default:
				return false;
		}
	}

};
