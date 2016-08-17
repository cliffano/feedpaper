<img align="right" src="https://raw.github.com/cliffano/feedpaper/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://img.shields.io/travis/cliffano/feedpaper.svg)](http://travis-ci.org/cliffano/feedpaper)
<br/>

Feedpaper
---------

Feedpaper is a serverless feed reader + readability mashup for reading on handheld devices.

This is handy for anyone who wants to speed-read the articles from a personalised list of web site feeds.

This is an experimental project using App.js, Terraform, and Amazon Web Services.

Architecture
------------

| Component      | Description                                                             |
|----------------|-------------------------------------------------------------------------|
| feedpaper-web  | Single page App.js web app served as AWS S3 static website              |
| feedpaper-api  | Content API using AWS API Gateway, and content fetcher using AWS Lambda |
| feedpaper-data | Content storage using AWS DynamoDB                                      |

[![Architecture Diagram](https://raw.github.com/cliffano/feedpaper/master/architecture.jpg)](https://raw.github.com/cliffano/feedpaper/master/architecture.jpg)

Installation
------------

    git clone https://github.com/cliffano/feedpaper


Configuration
-------------

Create a bucket on AWS S3.

Create `feedpaper.json`, `feeds.json`, and `terraform.tfvars` files.

Set up the following environment variables on your local machine:

    export FEEDPAPER_ENV=local
    export FEEDPAPER_CFG=/path/to/conf_dir

Usage
-----

    cd feedpaper-api

Colophon
--------

Articles:

* [Nestor – A Faster And Simpler CLI For Jenkins](http://blog.cliffano.com/2011/10/22/nestor-a-faster-and-simpler-cli-for-jenkins/)
