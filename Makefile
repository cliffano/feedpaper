init-stg:
	cd feedpaper-api && FEEDPAPER_ENV=stg make init && cd ..
	cd feedpaper-data && FEEDPAPER_ENV=stg make init && cd ..
	cd feedpaper-web && FEEDPAPER_ENV=stg make init && cd ..

init-prd:
	cd feedpaper-api && FEEDPAPER_ENV=prd make init && cd ..
	cd feedpaper-data && FEEDPAPER_ENV=prd make init && cd ..
	cd feedpaper-web && FEEDPAPER_ENV=prd make init && cd ..

tmux:
	tmuxinator start feedpaper

.PHONY: init-stg init-prd tmux
