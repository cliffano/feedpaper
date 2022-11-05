ifndef AWS_PROFILE
    $(error Please specify AWS_PROFILE)
endif
ifndef AWS_DEFAULT_PROFILE
    $(error Please specify AWS_DEFAULT_PROFILE)
endif

init-stg:
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-data && make init && cd .. && \
	cd feedpaper-api && make init && cd .. && \
	cd feedpaper-web && make init && cd ..

create-data-stg: init-stg
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-data && make all-no-clean && cd ..

create-api-stg: init-stg
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-api && (make all-no-clean || make infra || make infra) && cd ..

create-web-stg: init-stg
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-web && make all-no-clean && cd ..

create-all-stg: create-data-stg create-api-stg create-web-stg

update-data-stg: init-stg
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-data && make all && cd ..

update-api-stg: init-stg
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-api && (make all || make infra || make infra) && cd ..

update-web-stg: init-stg
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-web && make all && cd ..

update-all-stg: update-data-stg update-api-stg update-web-stg

delete-all-stg: init-stg
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-web && make infra-clean && cd .. && \
	cd feedpaper-api && make infra-clean && cd .. && \
	cd feedpaper-data && make infra-clean && cd ..

init-prd:
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-data && make init && cd .. && \
	cd feedpaper-api && make init && cd .. && \
	cd feedpaper-web && make init && cd ..

create-data-prd: init-prd
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-data && make all && cd ..

create-api-prd: init-prd
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-api && (make all || make infra || make infra) && cd ..

create-web-prd: init-prd
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-web && make all && cd ..

create-all-prd: create-data-prd create-api-prd create-web-prd

delete-all-prd: init-prd
	export FEEDPAPER_CFG=/opt/workspace/workspace-control/config/studio/feedpaper/ && \
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-web && make infra-clean && cd .. && \
	cd feedpaper-api && make infra-clean && cd .. && \
	cd feedpaper-data && make infra-clean && cd ..

.PHONY: init-stg create-data-stg create-api-stg create-web-stg create-all-stg delete-all-stg init-prd create-data-prd create-api-prd create-web-prd create-all-prd delete-all-prd
