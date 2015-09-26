variable "env" {}
variable "bucket_site" {}
variable "bucket_data" {}
variable "lambda_role" {}

provider "aws" {
    region = "ap-southeast-2"
}

provider "aws" {
    alias = "us"
    region = "us-west-2"
}

resource "aws_s3_bucket" "site" {
    bucket = "${var.bucket_site}"
    acl = "public-read"
    policy = "${file("../../ryokan/resources/feedpaper/${var.env}/bucket-policy-site.json")}"
    website {
        index_document = "index.html"
        error_document = "error.html"
    }
    tags {
        project = "feedpaper"
    }
    force_destroy = true
}

resource "aws_s3_bucket" "data" {
    bucket = "${var.bucket_data}"
    acl = "private"
    policy = "${file("../../ryokan/resources/feedpaper/${var.env}/bucket-policy-data.json")}"
    tags {
        project = "feedpaper"
    }
    force_destroy = true
}

resource "aws_lambda_function" "get-feed" {
    provider = "aws.us"
    filename = "../.bob/lambdas/get-feed.zip"
    function_name = "feedpaper-get-feed"
    role = "${var.lambda_role}"
    handler = "get-feed.handler"
    timeout = 5
}

resource "aws_lambda_function" "get-article" {
    provider = "aws.us"
    filename = "../.bob/lambdas/get-article.zip"
    function_name = "feedpaper-get-article"
    role = "${var.lambda_role}"
    handler = "get-article.handler"
    timeout = 10
}
