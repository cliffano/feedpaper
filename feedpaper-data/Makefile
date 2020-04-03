ifndef FEEDPAPER_ENV
    $(error Please specify FEEDPAPER_ENV)
endif
ifndef FEEDPAPER_CFG
    $(error Please specify FEEDPAPER_CFG)
endif

TF_BACKEND=$(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/backend-feedpaper-data.tf

all: init infra-clean infra

clean:
	bob clean
	rm -rf .terraform/

init: clean
	bob dep
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && terraform init -backend-config $(TF_BACKEND) -backend=true -force-copy -lock=false

build:
	bob build
	terraform graph

infra-clean:
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && terraform destroy -force

infra:
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && terraform apply

.PHONY: all build app-del app-set infra-del infra-set init
