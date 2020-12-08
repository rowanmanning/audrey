'use strict';

// Return the type of media for a mime-type
module.exports = function mediaType(mimeType) {
	if (mimeType.startsWith('audio/')) {
		return module.exports.AUDIO;
	}
	if (mimeType.startsWith('image/')) {
		return module.exports.IMAGE;
	}
	if (mimeType.startsWith('video/')) {
		return module.exports.VIDEO;
	}
	return module.exports.UNKNOWN;
};

module.exports.AUDIO = 'audio';
module.exports.IMAGE = 'image';
module.exports.VIDEO = 'video';

module.exports.UNKNOWN = 'unknown';
