browser-test:
	@echo browser test
	@./node_modules/mocha-phantomjs/bin/mocha-phantomjs test/test-runner.html

test:
	@echo server test
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter spec \
		--timeout 300 \
		--require should \
		--growl \
		test/test.js

build: install
	@echo build ...
	@component install
	@component build

install:
	npm install

.PHONY: test