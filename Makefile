
.PHONY: init lint

init:
	npm i -g cfn-lint

lint:
	for T in $(shell find templates -mindepth 1 -maxdepth 1); do \
		echo $$T ; \
		cfn-lint validate $$T ; \
	done \
