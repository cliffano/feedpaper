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
	bob deploy

infra-del:
	terraform destroy -var-file $(TF_VARS) -state=$(TF_STATE)

infra-set:
	terraform apply -var-file $(TF_VARS) -state=$(TF_STATE)

.PHONY: all build app-del app-set infra-del infra-set
