#!/bin/bash
npm install -g bob
export FEEDPAPER_ENV=ci
export FEEDPAPER_CFG=`pwd`/conf/
cd feedpaper-api && make clean init build && cd ..
cd feedpaper-data && make clean init build && cd ..
cd feedpaper-web && make clean init build && cd ..