FEEDPAPER_ENV=stg

all: infra-clean web-clean web-init infra-init

web-clean:
	bob clean

web-init:
	bob deploy

infra-clean:
	~/dev/terraform_0.6.3_darwin_amd64/terraform destroy -var-file ../../dotfiles/studio/feedpaper/$(FEEDPAPER_ENV)/terraform.tfvars -state=.bob/terraform.tstate

infra-init:
	~/dev/terraform_0.6.3_darwin_amd64/terraform apply -var-file ../../dotfiles/studio/feedpaper/$(FEEDPAPER_ENV)/terraform.tfvars -state=.bob/terraform.tstate

.PHONY: all web-clean web-init infra-clean infra-init
