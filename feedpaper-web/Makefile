ifndef FEEDPAPER_ENV
    $(error Please specify FEEDPAPER_ENV)
endif

TF_VARS=../../dotfiles/studio/feedpaper/$(FEEDPAPER_ENV)/terraform.tfvars
TF_CFG_BUCKET=ryokan-tf-states
TF_CFG_KEY=feedpaper/$(FEEDPAPER_ENV)/feedpaper-web.tfstate
TF_CFG_REGION=ap-southeast-2

all: infra-del app-del infra-set build app-set

init:
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
	bob deploy

infra-del:
	terraform remote pull
	terraform destroy -var-file $(TF_VARS)
	terraform remote push

infra-set:
	terraform remote pull
	terraform apply -var-file $(TF_VARS)
	terraform remote push

.PHONY: all build app-del app-set infra-del infra-set init
