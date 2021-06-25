
.PHONY: init lint

init:
	pip install cfn-lint

lint:
	@for T in $(shell find templates -mindepth 1 -maxdepth 1); do \
		echo $$T ; \
		cfn-lint validate -t $$T ; \
	done \

.PHONY: iam
iam:
	TEMPLATE=iam NAME=IAMConfig make deploy

.PHONY: users-development
users-development:
	TEMPLATE=users-development NAME=UsersConfig ARGS="--parameter-overrides DefaultPassword=$(DEFAULT_PASSWORD)" make deploy

.PHONY: password
password:
	TEMPLATE=password NAME=PasswordPolicyConfig make deploy

deploy:
	aws cloudformation deploy \
		--template-file templates/$(TEMPLATE).template.yaml \
		--stack-name $(NAME) \
		--capabilities CAPABILITY_NAMED_IAM CAPABILITY_IAM \
		--tags repo=aws-account-config $(ARGS)

