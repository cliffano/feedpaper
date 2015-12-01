FEEDPAPER_ENV=stg
TF_VARS=../../dotfiles/studio/feedpaper/$(FEEDPAPER_ENV)/terraform.tfvars
TF_STATE=.bob/terraform.tstate

all: build infra-del app-del app-set infra-set

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
	terraform destroy -var-file $(TF_VARS) -state=$(TF_STATE)

infra-set:
	terraform apply -var-file $(TF_VARS) -state=$(TF_STATE)

.PHONY: all build app-del app-set infra-del infra-set
