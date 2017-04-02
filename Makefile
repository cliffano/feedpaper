init-stg:
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-data && make init && cd .. && \
	cd feedpaper-api && make init && cd .. && \
	cd feedpaper-web && make init && cd ..

infra-clean-stg: init-stg
	export FEEDPAPER_ENV=stg && \
	cd feedpaper-web && make infra-clean && cd .. && \
	cd feedpaper-api && make infra-clean && cd .. && \
	cd feedpaper-data && make infra-clean && cd ..

all-stg: init-stg
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-data && make all && cd .. && \
	cd feedpaper-api && make all && cd ..

init-prd:
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-data && make init && cd .. && \
	cd feedpaper-api && make init && cd .. && \
	cd feedpaper-web && make init && cd ..

infra-clean-prd: init-prd
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-web && make infra-clean && cd .. && \
	cd feedpaper-api && make infra-clean && cd .. && \
	cd feedpaper-data && make infra-clean && cd ..

all-prd: init-prd
	export FEEDPAPER_ENV=prd && \
	cd feedpaper-data && make all && cd .. && \
	cd feedpaper-api && make all && cd ..

tmux:
	tmuxinator start feedpaper

.PHONY: init-stg init-prd tmux
