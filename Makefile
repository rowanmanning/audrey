
# Reusable Makefile
# ------------------------------------------------------------------------
# This section of the Makefile should not be modified, it includes
# commands from my reusable Makefile: https://github.com/rowanmanning/make
include node_modules/@rowanmanning/make/javascript/index.mk
# [edit below this line]
# ------------------------------------------------------------------------

start:
	@NODE_ENV=production node .

start-dev:
	@NODE_ENV=development nodemon -e js,json .

test-feeds:
	@mocha "test/feeds/**/*.test.js" --recursive --timeout 10000 --slow 6000
