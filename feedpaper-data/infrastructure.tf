variable "db_data" {}
variable "iam_role_name" {}
variable "lambda_function_clean_data" {}

provider "aws" {
    region = "ap-southeast-2"
}

provider "aws" {
    alias = "us"
    region = "us-west-2"
}

resource "aws_dynamodb_table" "data" {
    provider = "aws.us"
    name = "${var.db_data}"
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
