
.PHONY: init

init:
	npm i -g cfn-lint

lint:
	cfn-lint validate cloudformation.template.yml
