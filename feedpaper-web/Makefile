ifndef FEEDPAPER_ENV
    $(error Please specify FEEDPAPER_ENV)
endif
ifndef FEEDPAPER_CFG
    $(error Please specify FEEDPAPER_CFG)
endif

TF_BACKEND=$(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/backend-feedpaper-web.tf

all: init infra-clean infra build deploy

all-no-clean: init infra build deploy

clean:
	bob clean
	rm -rf .terraform/
	rm -f package-lock.json
	rm -f .terraform.lock.hcl

init: clean
	bob dep
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && terraform init -backend-config $(TF_BACKEND) -backend=true 

build:
	rm -f /usr/bin/ae86
	npm install -g ae86
	ae86 gen --out-dir `pwd`/.bob/site/ae86/
	terraform graph

deploy:
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && \
	aws s3 cp `pwd`/.bob/site/ae86/ s3://$${TF_VAR_bucket_site} --recursive

	# build:
	# 	bob build
	# 	terraform graph
	#
	# deploy:
	# 	rm -f .sendman.json
	# 	ln -s .sendman-$(FEEDPAPER_ENV).json .sendman.json
	# 	bob deploy
	# 	# deploy twice due to intermittent incomplete S3 upload
	# 	bob deploy

infra-clean:
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && terraform destroy -auto-approve

infra:
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && terraform apply -auto-approve

.PHONY: all build app-del app-set infra-del infra-set init
