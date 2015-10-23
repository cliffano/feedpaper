ENV=stg

api-clean:
	bob clean

api-init:
	mkdir -p .bob/lambdas/
	cp lib/*.js .bob/lambdas/
	cp ../conf/$(ENV)/feeds.json .bob/lambdas/feeds.json
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

infra-clean:
	~/dev/terraform_0.6.3_darwin_amd64/terraform destroy -var-file ../../dotfiles/studio/feedpaper/$(ENV)/terraform.tfvars -state=.bob/terraform.tstate

infra-init:
	~/dev/terraform_0.6.3_darwin_amd64/terraform apply -var-file ../../dotfiles/studio/feedpaper/$(ENV)/terraform.tfvars -state=.bob/terraform.tstate
