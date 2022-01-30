variable "region" {}
variable "remote_state_bucket" {}
variable "remote_state_key_prefix" {}
variable "remote_state_region" {}
variable "db_data" {}
variable "iam_role_name" {}
variable "lambda_function_clean_data" {}

terraform {
  backend "s3" {}
}

data "terraform_remote_state" "remote_state" {
  backend = "s3"
  config = {
    bucket = var.remote_state_bucket
    key    = "${var.remote_state_key_prefix}/feedpaper-data.tfstate"
    region = var.remote_state_region
  }
}

provider "aws" {
    region = var.region
    version = "2.54.0"
}

resource "aws_dynamodb_table" "data" {
    provider = aws
    name = var.db_data
    read_capacity = 1
    write_capacity = 1
    hash_key = "id"
    attribute {
      name = "id"
      type = "S"
    }
    ttl {
      attribute_name = "TimeToExist"
      enabled = true
    }
}
