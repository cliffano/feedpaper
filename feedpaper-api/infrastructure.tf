variable "env" {}
variable "bucket_data" {}
variable "db_data" {}
variable "lambda_role" {}

provider "aws" {
    region = "ap-southeast-2"
}

provider "aws" {
    alias = "us"
    region = "us-west-2"
}

resource "aws_s3_bucket" "data" {
    bucket = "${var.bucket_data}"
    acl = "private"
    policy = <<EOF
{
  "Id": "bucket_policy_site",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "bucket_policy_site_1",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.bucket_data}/*",
      "Principal": "*"
    }
  ]
}
EOF
    tags {
        project = "feedpaper"
    }
    force_destroy = true
}

resource "aws_dynamodb_table" "data" {
    provider = "aws.us"
    name = "${var.db_data}"
    read_capacity = 20
    write_capacity = 20
    hash_key = "url"
    attribute {
      name = "url"
      type = "S"
    }
}

resource "aws_lambda_function" "get-feed" {
    provider = "aws.us"
    filename = ".bob/lambdas/get-feed.zip"
    function_name = "feedpaper-get-feed"
    role = "${var.lambda_role}"
    handler = "get-feed.handler"
    timeout = 10
}

resource "aws_lambda_function" "get-article" {
    provider = "aws.us"
    filename = ".bob/lambdas/get-article.zip"
    function_name = "feedpaper-get-article"
    role = "${var.lambda_role}"
    handler = "get-article.handler"
    timeout = 10
}
