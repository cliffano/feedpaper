ifndef FEEDPAPER_ENV
    $(error Please specify FEEDPAPER_ENV)
endif
ifndef FEEDPAPER_CFG
    $(error Please specify FEEDPAPER_CFG)
endif

TF_BACKEND=$(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/backend-feedpaper-data.tf

all: init infra-clean infra

all-no-clean: init infra

clean:
	bob clean
	rm -rf .terraform/
	rm -f package-lock.json
	rm -f .terraform.lock.hcl

init: clean
	bob dep
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && terraform init -backend-config $(TF_BACKEND) -backend=true -migrate-state

build:
	bob build
	terraform graph

infra-clean:
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && terraform destroy -auto-approve

infra:
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && terraform apply -auto-approve

.PHONY: all build app-del app-set infra-del infra-set init
