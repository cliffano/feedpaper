ifndef FEEDPAPER_ENV
    $(error Please specify FEEDPAPER_ENV)
endif
ifndef FEEDPAPER_CFG
    $(error Please specify FEEDPAPER_CFG)
endif

TF_VARS=$(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform.tfvars
TF_CFG_BUCKET=ryokan-tf-states
TF_CFG_KEY=feedpaper/$(FEEDPAPER_ENV)/feedpaper-data.tfstate
TF_CFG_REGION=ap-southeast-2

all: init infra-clean infra build deploy

clean:
	bob clean
	rm -rf .terraform/

init: clean
	bob dep
	terraform remote config \
		-backend=s3 \
		-backend-config="bucket=$(TF_CFG_BUCKET)" \
		-backend-config="key=$(TF_CFG_KEY)" \
		-backend-config="region=$(TF_CFG_REGION)"

build:
	bob build
	terraform graph
	mkdir -p .bob/lambdas/
	cp lib/*.js .bob/lambdas/
	rm -f .bob/lambdas/node_modules
	ln -s ../../node_modules/ .bob/lambdas/node_modules
	cd .bob/lambdas/ &&\
	zip clean-data.zip --recurse-paths\
	  node_modules/aws-sdk/\
		clean-data.js

deploy:
	echo "TODO - extract lambda deployment from default infrastructure.tf"

infra-clean:
	terraform remote pull
	terraform destroy -var-file $(TF_VARS)
	terraform remote push

infra:
	terraform remote pull
	terraform apply -var-file $(TF_VARS)
	terraform remote push

.PHONY: all build app-del app-set infra-del infra-set init
