init-stg:
	export FEEDPAPER_CFG=/opt/workspace/config/studio/feedpaper && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-data && make init && cd .. && \
	cd feedpaper-api && make init && cd .. && \
	cd feedpaper-web && make init && cd ..

infra-clean-stg: init-stg
	export FEEDPAPER_CFG=/opt/workspace/config/studio/feedpaper && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-web && make infra-clean && cd .. && \
	cd feedpaper-api && make infra-clean && cd .. && \
	cd feedpaper-data && make infra-clean && cd ..

all-data-stg: init-stg
	export FEEDPAPER_CFG=/opt/workspace/config/studio/feedpaper && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-data && make all && cd ..

all-pre-stg: init-stg
	export FEEDPAPER_CFG=/opt/workspace/config/studio/feedpaper && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-data && make all && cd .. && \
	cd feedpaper-api && (make all || make infra || make infra) && cd ..

all-post-stg: init-stg
	export FEEDPAPER_CFG=/opt/workspace/config/studio/feedpaper && \
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-web && make all && cd ..

init-prd:
	export FEEDPAPER_CFG=/opt/workspace/config/studio/feedpaper && \
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-data && make init && cd .. && \
	cd feedpaper-api && make init && cd .. && \
	cd feedpaper-web && make init && cd ..

infra-clean-prd: init-prd
	export FEEDPAPER_CFG=/opt/workspace/config/studio/feedpaper && \
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-web && make infra-clean && cd .. && \
	cd feedpaper-api && make infra-clean && cd .. && \
	cd feedpaper-data && make infra-clean && cd ..

all-data-prd: init-prd
	export FEEDPAPER_CFG=/opt/workspace/config/studio/feedpaper && \
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-data && make all && cd ..

all-api-prd: init-prd
	export FEEDPAPER_CFG=/opt/workspace/config/studio/feedpaper && \
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-api && (make all || make infra || make infra) && cd ..

all-web-prd: init-prd
	export FEEDPAPER_CFG=/opt/workspace/config/studio/feedpaper && \
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-web && make all && cd ..

all-prd: all-data-prd all-api-prd all-web-prd

.PHONY: init-stg init-prd
