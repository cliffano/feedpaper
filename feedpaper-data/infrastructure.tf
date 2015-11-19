variable "db_data_conf" {}
variable "db_data_feeds" {}
variable "db_data_articles" {}

provider "aws" {
    region = "ap-southeast-2"
}

provider "aws" {
    alias = "us"
    region = "us-west-2"
}

resource "aws_dynamodb_table" "data_conf" {
    provider = "aws.us"
    name = "${var.db_data_conf}"
    read_capacity = 5
    write_capacity = 5
    hash_key = "id"
    attribute {
      name = "id"
      type = "S"
    }
    attribute {
      name = "url"
      type = "S"
    }
}

resource "aws_dynamodb_table" "data_feeds" {
    provider = "aws.us"
    name = "${var.db_data_feeds}"
    read_capacity = 5
    write_capacity = 5
    hash_key = "url"
    attribute {
      name = "url"
      type = "S"
    }
    attribute {
      name = "articles"
      type = "S"
    }
}

resource "aws_dynamodb_table" "data_articles" {
    provider = "aws.us"
    name = "${var.db_data_articles}"
    read_capacity = 5
    write_capacity = 5
    hash_key = "url"
    attribute {
      name = "url"
      type = "S"
    }
    attribute {
      name = "content"
      type = "S"
    }
}
