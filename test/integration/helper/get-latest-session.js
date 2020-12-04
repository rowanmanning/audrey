'use strict';

module.exports = function getLatestSession() {
	return global.app.models.Session.findOne().sort('expires');
};
