'use strict';

const got = require('got');
const mediaType = require('../lib/media-type');
const requireAuth = require('../middleware/require-auth');
const userAgent = require('../lib/user-agent');

module.exports = function mountProxyImageController(app) {
	const {router} = app;

	const maxAge = (
		app.env === 'production' ?
			Math.floor(app.options.publicCacheMaxAge / 1000) :
			0
	);

	router.get('/proxy-image/:image', [
		requireAuth(),
		proxyImage
	]);

	function proxyImage(request, response, next) {
		const imageRequest = got.stream(request.params.image, {
			headers: {
				'User-Agent': userAgent()
			}
		});

		// Proxy if the response is an image
		imageRequest.on('response', httpResponse => {
			if (isImageResponse(httpResponse)) {

				// Clean up the image headers
				httpResponse.headers = {
					'Cache-Control': `public, max-age=${maxAge}`,
					'Content-Length': httpResponse.headers['content-length'],
					'Content-Type': httpResponse.headers['content-type']
				};
				return imageRequest.pipe(response);
			}
			return next(new Error('Proxy URL did not respond with an image'));
		});

		// Handle errors
		imageRequest.on('error', next);
	}

	function isImageResponse(httpResponse) {
		return mediaType(httpResponse.headers['content-type']) === mediaType.IMAGE;
	}

};
