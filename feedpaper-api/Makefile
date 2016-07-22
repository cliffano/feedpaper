ifndef FEEDPAPER_ENV
    $(error Please specify FEEDPAPER_ENV)
endif
ifndef FEEDPAPER_CFG
    $(error Please specify FEEDPAPER_CFG)
endif

TF_VARS=$(FEEDPAPER_CFG)/$(FEEDPAPER_ENV)/terraform.tfvars
TF_CFG_BUCKET=ryokan-tf-states
TF_CFG_KEY=feedpaper/$(FEEDPAPER_ENV)/feedpaper-api.tfstate
TF_CFG_REGION=ap-southeast-2

all: infra-del app-del build app-set infra-set

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

app-del:
	bob clean

app-set:
	mkdir -p .bob/lambdas/
	cp lib/*.js .bob/lambdas/
	cp ../conf/$(FEEDPAPER_ENV)/feeds.json .bob/lambdas/feeds.json
	rm -f .bob/lambdas/node_modules
	ln -s ../../node_modules/ .bob/lambdas/node_modules
	cd .bob/lambdas/ &&\
	zip get-feed.zip --recurse-paths\
		node_modules/aws-sdk/\
		node_modules/feed-read/\
		node_modules/slug/\
		get-feed.js\
		feeds.json &&\
	zip get-article.zip --recurse-paths\
		node_modules/aws-sdk/\
		node_modules/node-read/\
		node_modules/slug/\
		get-article.js

infra-del:
	terraform remote pull
	terraform destroy -var-file $(TF_VARS)
	terraform remote push

infra-set:
	terraform remote pull
	~/dev/terraform_0.6.16_darwin_amd64/terraform apply -var-file $(TF_VARS)
	terraform remote push

.PHONY: all build app-del app-set infra-del infra-set init
