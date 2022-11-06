ifndef FEEDPAPER_ENV
    $(error Please specify FEEDPAPER_ENV)
endif
ifndef FEEDPAPER_CFG
    $(error Please specify FEEDPAPER_CFG)
endif

TF_BACKEND=$(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/backend-feedpaper-api.tf

all: init infra-clean build deploy infra

all-no-clean: init build deploy infra

clean:
	bob clean
	rm -rf .terraform/
	rm -f package-lock.json
	rm -f .terraform.lock.hcl

init: clean
	bob dep
	node_modules/.bin/jsonlint $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/feedpaper.json $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/feeds.json
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh &&  terraform init -backend-config $(TF_BACKEND) -backend=true -migrate-state

build:
	bob build
	terraform graph
	mkdir -p .bob/lambdas/
	cp lib/*.js .bob/lambdas/
	cp $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/feedpaper.json .bob/lambdas/feedpaper.json
	cp $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/feeds.json .bob/lambdas/feeds.json
	rm -f .bob/lambdas/node_modules
	ln -s ../../node_modules/ .bob/lambdas/node_modules
	cd .bob/lambdas/ &&\
	zip get-feed.zip --recurse-paths\
		node_modules/\
		get-feed.js\
		feedpaper.json\
		feeds.json &&\
	zip get-article.zip --recurse-paths\
		node_modules/\
		get-article.js\
		feedpaper.json

deploy:
	echo "TODO - extract lambda deployment from default infrastructure.tf"

infra-clean:
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && terraform destroy

infra:
	. $(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform-tfvars.sh && terraform apply -auto-approve

.PHONY: all build app-del app-set infra-del infra-set init
