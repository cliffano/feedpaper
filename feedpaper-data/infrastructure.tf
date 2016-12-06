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
}

resource "aws_iam_role" "iam_role_lambda" {
    name = "${var.iam_role_name}-lambda-data"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "iam_policy_lambda" {
    name = "${var.iam_role_name}-lambda-policy-data"
    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:*",
        "lambda:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "iam_policy_attachment_lambda" {
    name = "${var.iam_role_name}-lambda-policy-attachment-data"
    roles = ["${aws_iam_role.iam_role_lambda.name}"]
    policy_arn = "${aws_iam_policy.iam_policy_lambda.arn}"
}

resource "aws_lambda_function" "clean-data" {
    provider = "aws.us"
    filename = ".bob/lambdas/clean-data.zip"
    function_name = "${var.lambda_function_clean_data}"
    role = "${aws_iam_role.iam_role_lambda.arn}"
    handler = "clean-data.handler"
    timeout = 10
}

resource "aws_cloudwatch_event_rule" "event_rule_clean_data" {
    provider = "aws.us"
    name = "event_rule_clean_data"
    schedule_expression = "rate(60 minutes)"
}

resource "aws_cloudwatch_event_target" "event_target_clean_data" {
    provider = "aws.us"
    rule = "${aws_cloudwatch_event_rule.event_rule_clean_data.name}"
    target_id = "clean-data"
    arn = "${aws_lambda_function.clean-data.arn}"
}

resource "aws_lambda_permission" "lambda_permission_clean_data" {
    provider = "aws.us"
    statement_id = "AllowExecutionFromCloudWatch"
    action = "lambda:InvokeFunction"
    function_name = "${aws_lambda_function.clean-data.function_name}"
    principal = "events.amazonaws.com"
    source_arn = "${aws_cloudwatch_event_rule.event_rule_clean_data.arn}"
}
