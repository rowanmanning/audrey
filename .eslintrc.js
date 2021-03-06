'use strict';

module.exports = {
	extends: [
		'@rowanmanning/eslint-config',
		'@rowanmanning/eslint-config/jsx'
	],
	rules: {
		'class-methods-use-this': 'off',
		'no-invalid-this': 'off',
		'no-underscore-dangle': 'off',
		'require-atomic-updates': 'off'
	}
};
