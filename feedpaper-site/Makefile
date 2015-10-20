ENV=stg

site-clean:
	bob clean

site-init:
	FEEDPAPER_ENV=$(ENV) bob deploy

infra-clean:
	~/dev/terraform_0.6.3_darwin_amd64/terraform destroy -var-file ../../dotfiles/studio/feedpaper/$(ENV)/terraform.tfvars -state=../.bob/terraform.tstate

infra-init:
	~/dev/terraform_0.6.3_darwin_amd64/terraform apply -var-file ../../dotfiles/studio/feedpaper/$(ENV)/terraform.tfvars -state=../.bob/terraform.tstate
