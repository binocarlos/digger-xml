browser-test:
	@echo browser test
	@./node_modules/mocha-phantomjs/bin/mocha-phantomjs test/test-runner.html

server-test:
	@echo server test
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter spec \
		--timeout 300 \
		--require should \
		--growl \
		test/test.js

test: server-test browser-test

build: install
	@echo build ...
	@component install
	@component build

install:
	npm install

.PHONY: test