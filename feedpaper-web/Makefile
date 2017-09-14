ifndef FEEDPAPER_ENV
    $(error Please specify FEEDPAPER_ENV)
endif
ifndef FEEDPAPER_CFG
    $(error Please specify FEEDPAPER_CFG)
endif

TF_VARS=$(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform.tfvars
TF_BACKEND=$(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/backend-feedpaper-web.tf

all: init infra-clean infra build deploy

clean:
	bob clean
	rm -rf .terraform/

init: clean
	bob dep
	terraform init -var-file $(TF_VARS) -backend-config $(TF_BACKEND) -backend=true -force-copy -lock=false

build:
	bob build
	terraform graph

deploy:
	rm -f .sendman.json
	ln -s .sendman-$(FEEDPAPER_ENV).json .sendman.json
	bob deploy
	# deploy twice due to intermittent incomplete S3 upload
	bob deploy

infra-clean:
	terraform destroy -var-file $(TF_VARS) -force

infra:
	terraform apply -var-file $(TF_VARS)

.PHONY: all build app-del app-set infra-del infra-set init
