FROM node:0.12-slim

MAINTAINER Cliffano Subagio (blah@cliffano.com)

EXPOSE 9000

RUN node --version
RUN npm --version

ADD . /app/feedpaper
WORKDIR /app/feedpaper

RUN npm install -g forever forever-monitor
CMD /usr/local/bin/forever start bin/feedpaper start --feeds-file /app/data/feeds.json --conf-dir /app/conf/