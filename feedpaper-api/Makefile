ifndef FEEDPAPER_ENV
    $(error Please specify FEEDPAPER_ENV)
endif
ifndef FEEDPAPER_CFG
    $(error Please specify FEEDPAPER_CFG)
endif

TF_VARS=$(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform.tfvars

all: init infra-clean build deploy infra

clean:
	bob clean
	rm -rf .terraform/

init: clean
	bob dep

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
		node_modules/aws-sdk/\
		node_modules/feed-read/\
		node_modules/slug/\
		get-feed.js\
		feedpaper.json\
		feeds.json &&\
	zip get-article.zip --recurse-paths\
		node_modules/aws-sdk/\
		node_modules/node-read/\
		node_modules/slug/\
		get-article.js\
		feedpaper.json

deploy:
	echo "TODO - extract lambda deployment from default infrastructure.tf"

infra-clean:
	terraform destroy -var-file $(TF_VARS) -force

infra:
	terraform apply -var-file $(TF_VARS)

.PHONY: all build app-del app-set infra-del infra-set init
