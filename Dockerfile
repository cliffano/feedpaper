FROM node:0.12.0

MAINTAINER Cliffano Subagio (blah@cliffano.com)

EXPOSE 9000

RUN node --version
RUN npm --version

ADD . /app/stage
WORKDIR /app/stage

RUN npm install .
RUN npm install -g forever forever-monitor
#CMD /usr/local/bin/forever start /app/stage/bin/feedpaper start --feeds-file /app/data/feeds.json --conf-dir /app/conf/
CMD /app/stage/bin/feedpaper start --feeds-file /app/data/feeds.json --conf-dir /app/conf/