clean:
	bob clean

init:
	mkdir -p .bob/lambdas/

site: init
	FEEDPAPER_ENV=stg bob site

site-deploy: site
	bob send

lambdas: init
	cp lib/*.js .bob/lambdas/
	rm -f .bob/lambdas/node_modules
	ln -s ../../node_modules/ .bob/lambdas/node_modules
	cd .bob/lambdas/ &&\
	zip get-feed.zip --recurse-paths\
		node_modules/aws-sdk/\
		node_modules/feed-read/\
		node_modules/slug/\
		get-feed.js &&\
	zip get-article.zip --recurse-paths\
		node_modules/aws-sdk/\
		node_modules/node-read/\
		node_modules/slug/\
		get-article.js

infra-clean:
	cd conf/ && ~/dev/terraform_0.6.3_darwin_amd64/terraform destroy -var-file ../../ryokan/resources/feedpaper/stg/terraform.tfvars -state=../.bob/terraform.tstate

infra-init:
	cd conf/ && ~/dev/terraform_0.6.3_darwin_amd64/terraform apply -var-file ../../ryokan/resources/feedpaper/stg/terraform.tfvars -state=../.bob/terraform.tstate
