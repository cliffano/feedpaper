variable "env" {}
variable "lambda_role" {}
variable "lambda_function_get_feed" {}
variable "lambda_function_get_article" {}

provider "aws" {
    region = "ap-southeast-2"
}

provider "aws" {
    alias = "us"
    region = "us-west-2"
}

resource "aws_lambda_function" "get-feed" {
    provider = "aws.us"
    filename = ".bob/lambdas/get-feed.zip"
    function_name = "${var.lambda_function_get_feed}"
    role = "${var.lambda_role}"
    handler = "get-feed.handler"
    timeout = 10
}

resource "aws_lambda_function" "get-article" {
    provider = "aws.us"
    filename = ".bob/lambdas/get-article.zip"
    function_name = "${var.lambda_function_get_article}"
    role = "${var.lambda_role}"
    handler = "get-article.handler"
    timeout = 10
}
