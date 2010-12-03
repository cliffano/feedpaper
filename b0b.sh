#! /bin/sh

make -f /var/www/tool/b0b/Makefile \
    APP_NAME="feedtouch" \
    APP_VERSION="0.1-SNAPSHOT" \
    APP_DIR=`pwd` \
    DEPLOY_SUBDIR="cliffano.com/feedtouch" \
    $1 $2 $3 $4 $5 $6 $7 $8 $9