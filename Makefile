install:
	@npm install

build: install
	@echo build ...
	@./node_modules/.bin/component-install
	@./node_modules/.bin/component-build

browser-test: build
	@echo browser test ...
	@./node_modules/mocha-phantomjs/bin/mocha-phantomjs test/test-runner.html

server-test:
	@echo server test
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter spec \
		--timeout 300 \
		--require should \
		--growl \
		test/test.js

test: browser-test server-test

.PHONY: test build