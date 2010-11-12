APP_NAME = feedtouch
APP_VERSION = 0.1-SNAPSHOT
APP_FULLNAME = $(APP_NAME)-$(APP_VERSION)
BUILD_BASE = build
BUILD_PACKAGE = $(BUILD_BASE)/package
DEPLOY_HOST = teuchi
DEPLOY_PORT = 2218
DEPLOY_DIR = /var/www/cliffano.com/feedtouch
LOGS_DIR = /var/www/logs

init:
	echo "B0b shall build."

clean:
	rm -rf $(BUILD_BASE)
	rm -f nohup.*
	
dep:
	npm install express ejs

start-dev: clean
	./ghibli.sh start dev

stop:
	./ghibli.sh stop

status:
	./ghibli.sh status
    
package: clean
	mkdir -p $(BUILD_PACKAGE)
	tar --exclude test --exclude .svn --exclude ._* -cvf $(BUILD_PACKAGE)/$(APP_FULLNAME).tar *
	gzip $(BUILD_PACKAGE)/$(APP_FULLNAME).tar
	
deploy: clean package
	ssh -p $(DEPLOY_PORT) $(DEPLOY_HOST) 'cd $(DEPLOY_DIR); rm -rf *;'
	scp -P $(DEPLOY_PORT) $(BUILD_PACKAGE)/$(APP_FULLNAME).tar.gz $(DEPLOY_HOST):$(DEPLOY_DIR)
	ssh -p $(DEPLOY_PORT) $(DEPLOY_HOST) 'cd $(DEPLOY_DIR); gunzip *.tar.gz; tar -xvf *.tar; rm *.tar; ./ghibli.sh stop; ./ghibli.sh start prd;'
	
.PHONY: init clean start stop status package deploy