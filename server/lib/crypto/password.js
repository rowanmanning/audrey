'use strict';

const bcrypt = require('bcrypt');

// Define a password hashing function
exports.hashPassword = function hashPassword(plainTextPassword) {
	const saltRounds = 10;
	return bcrypt.hash(plainTextPassword, saltRounds);
};

// Define a password checking function
exports.comparePasswordToHash = function comparePasswordToHash(plainTextPassword, passwordHash) {
	return bcrypt.compare(plainTextPassword, passwordHash);
};
