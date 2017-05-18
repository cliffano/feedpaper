variable "region" {}
variable "remote_state_bucket" {}
variable "remote_state_key" {}
variable "remote_state_region" {}
variable "iam_role_name" {}
variable "lambda_function_get_feed" {}
variable "lambda_function_get_article" {}
variable "api_name" {}
variable "api_version" {}
variable "route53_domain_name_api" {}
variable "route53_domain_zoneid" {}

data "terraform_remote_state" "remote_state" {
  backend = "s3"
  config {
    bucket = "${var.remote_state_bucket}"
    key    = "${var.remote_state_key}"
    region = "${var.remote_state_region}"
  }
}

provider "aws" {
    region = "${var.region}"
}

provider "aws" {
    alias = "us"
    region = "us-west-2"
}

#resource "aws_api_gateway_account" "apigateway" {
#  provider = "aws.us"
#  cloudwatch_role_arn = "${aws_iam_role.iam_role_apigateway.arn}"
#}

resource "aws_iam_role" "iam_role_lambda" {
    name = "${var.iam_role_name}-lambda-api"
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
    name = "${var.iam_role_name}-lambda-policy-api"
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
    name = "${var.iam_role_name}-lambda-policy-attachment-api"
    roles = ["${aws_iam_role.iam_role_lambda.name}"]
    policy_arn = "${aws_iam_policy.iam_policy_lambda.arn}"
}

resource "aws_lambda_function" "get-feed" {
    provider = "aws.us"
    filename = ".bob/lambdas/get-feed.zip"
    function_name = "${var.lambda_function_get_feed}"
    role = "${aws_iam_role.iam_role_lambda.arn}"
    handler = "get-feed.handler"
    timeout = 10
    runtime = "nodejs6.10"
}

resource "aws_lambda_function" "get-article" {
    provider = "aws.us"
    filename = ".bob/lambdas/get-article.zip"
    function_name = "${var.lambda_function_get_article}"
    role = "${aws_iam_role.iam_role_lambda.arn}"
    handler = "get-article.handler"
    timeout = 20
    runtime = "nodejs6.10"
}

resource "aws_iam_role" "iam_role_apigateway" {
    name = "${var.iam_role_name}-apigateway"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "iam_policy_apigateway" {
    name = "${var.iam_role_name}-apigateway-policy"
    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "iam:PassRole",
        "lambda:InvokeFunction"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "iam_policy_attachment_apigateway" {
    name = "${var.iam_role_name}-apigateway-policy-attachment"
    roles = ["${aws_iam_role.iam_role_apigateway.name}"]
    policy_arn = "${aws_iam_policy.iam_policy_apigateway.arn}"
}

resource "aws_api_gateway_rest_api" "api" {
    provider = "aws.us"
    name = "${var.api_name}"
    description = "${var.api_name}"
}

resource "aws_route53_record" "domain" {
  name = "${var.route53_domain_name_api}"
  zone_id = "${var.route53_domain_zoneid}"
  type = "CNAME"
  ttl = "60"
  records = ["${aws_api_gateway_rest_api.api.id}.execute-api.us-west-2.amazonaws.com"]
}

resource "aws_api_gateway_resource" "api_resource" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    parent_id = "${aws_api_gateway_rest_api.api.root_resource_id}"
    path_part = "${var.api_name}"
}

resource "aws_api_gateway_resource" "api_resource_data" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    parent_id = "${aws_api_gateway_resource.api_resource.id}"
    path_part = "data"
}

resource "aws_api_gateway_resource" "api_resource_data_feed" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    parent_id = "${aws_api_gateway_resource.api_resource_data.id}"
    path_part = "feed"
}

resource "aws_api_gateway_resource" "api_resource_data_feed_categoryid" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    parent_id = "${aws_api_gateway_resource.api_resource_data_feed.id}"
    path_part = "{categoryId}"
}

resource "aws_api_gateway_resource" "api_resource_data_feed_categoryid_feedid" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    parent_id = "${aws_api_gateway_resource.api_resource_data_feed_categoryid.id}"
    path_part = "{feedId}"
}

resource "aws_api_gateway_method" "api_method_data_feed_categoryid_feedid" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    resource_id = "${aws_api_gateway_resource.api_resource_data_feed_categoryid_feedid.id}"
    http_method = "GET"
    authorization = "NONE"
}

resource "aws_api_gateway_method_response" "api_method_response_data_feed_categoryid_feedid" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    resource_id = "${aws_api_gateway_resource.api_resource_data_feed_categoryid_feedid.id}"
    http_method = "${aws_api_gateway_method.api_method_data_feed_categoryid_feedid.http_method}"
    status_code = "200"
    response_models = {
      "application/json" = "Empty"
    }
    response_parameters = {
       "method.response.header.Access-Control-Allow-Headers" = true
       "method.response.header.Access-Control-Allow-Methods" = true
       "method.response.header.Access-Control-Allow-Origin" = true
    }
}

resource "aws_api_gateway_integration" "api_integration_data_feed_categoryid_feedid" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    resource_id = "${aws_api_gateway_resource.api_resource_data_feed_categoryid_feedid.id}"
    http_method = "GET"
    type = "AWS"
    integration_http_method = "POST"
    uri = "arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/${aws_lambda_function.get-feed.arn}/invocations"
    credentials = "${aws_iam_role.iam_role_apigateway.arn}"
    request_templates = {
      "application/json" = <<EOF
#set($inputRoot = $input.path('$'))
{
  "categoryId" : "$input.params('categoryId')",
  "feedId" : "$input.params('feedId')"
}
EOF
    }
}

resource "aws_api_gateway_integration_response" "api_integration_response_data_feed_categoryid_feedid" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    resource_id = "${aws_api_gateway_resource.api_resource_data_feed_categoryid_feedid.id}"
    http_method = "GET"
    status_code = "${aws_api_gateway_method_response.api_method_response_data_feed_categoryid_feedid.status_code}"
    response_templates = {
      "application/json" = ""
    }
    response_parameters = {
       "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization'"
       "method.response.header.Access-Control-Allow-Methods" = "'GET'"
       "method.response.header.Access-Control-Allow-Origin" = "'*'"
    }
    depends_on = ["aws_api_gateway_integration.api_integration_data_feed_categoryid_feedid"]
}

resource "aws_api_gateway_resource" "api_resource_data_article" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    parent_id = "${aws_api_gateway_resource.api_resource_data.id}"
    path_part = "article"
}

resource "aws_api_gateway_resource" "api_resource_data_article_url" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    parent_id = "${aws_api_gateway_resource.api_resource_data_article.id}"
    path_part = "{url}"
}

resource "aws_api_gateway_method" "api_method_data_article_url" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    resource_id = "${aws_api_gateway_resource.api_resource_data_article_url.id}"
    http_method = "GET"
    authorization = "NONE"
}

resource "aws_api_gateway_method_response" "api_method_response_data_article_url" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    resource_id = "${aws_api_gateway_resource.api_resource_data_article_url.id}"
    http_method = "${aws_api_gateway_method.api_method_data_article_url.http_method}"
    status_code = "200"
    response_models = {
      "application/json" = "Empty"
    }
    response_parameters = {
       "method.response.header.Access-Control-Allow-Headers" = true
       "method.response.header.Access-Control-Allow-Methods" = true
       "method.response.header.Access-Control-Allow-Origin" = true
    }
}

resource "aws_api_gateway_integration" "api_integration_data_article_url" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    resource_id = "${aws_api_gateway_resource.api_resource_data_article_url.id}"
    http_method = "GET"
    type = "AWS"
    integration_http_method = "POST"
    uri = "arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/${aws_lambda_function.get-article.arn}/invocations"
    credentials = "${aws_iam_role.iam_role_apigateway.arn}"
    request_templates = {
      "application/json" = <<EOF
#set($inputRoot = $input.path('$'))
{
  "url" : "$input.params('url')"
}
EOF
    }
}

resource "aws_api_gateway_integration_response" "api_integration_response_data_article_url" {
    provider = "aws.us"
    rest_api_id = "${aws_api_gateway_rest_api.api.id}"
    resource_id = "${aws_api_gateway_resource.api_resource_data_article_url.id}"
    http_method = "GET"
    status_code = "${aws_api_gateway_method_response.api_method_response_data_article_url.status_code}"
    response_templates = {
      "application/json" = ""
    }
    response_parameters = {
       "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization'"
       "method.response.header.Access-Control-Allow-Methods" = "'GET'"
       "method.response.header.Access-Control-Allow-Origin" = "'*'"
    }
    depends_on = ["aws_api_gateway_integration.api_integration_data_article_url"]
}

resource "aws_api_gateway_model" "api_model_get-feed" {
  provider = "aws.us"
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  name = "GetFeed"
  description = ""
  content_type = "application/json"
  schema = <<EOF
{
  "$schema" : "http://json-schema.org/draft-04/schema#",
  "title" : "GetFeed Model Schema",
  "type" : "object",
  "properties" : {
    "categoryId" : { "type" : "string" },
    "feedId" : { "type" : "string" }
  }
}
EOF
}

resource "aws_api_gateway_model" "api_model_get-article" {
  provider = "aws.us"
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  name = "GetArticle"
  description = ""
  content_type = "application/json"
  schema = <<EOF
{
  "$schema" : "http://json-schema.org/draft-04/schema#",
  "title" : "GetArticle Model Schema",
  "type" : "object",
  "properties" : {
    "url" : { "type" : "string" }
  }
}
EOF
}

resource "aws_api_gateway_deployment" "api_deployment" {
  provider = "aws.us"
  stage_name = "v${var.api_version}"
  rest_api_id = "${aws_api_gateway_rest_api.api.id}"
  depends_on = [
    "aws_api_gateway_method.api_method_data_feed_categoryid_feedid",
    "aws_api_gateway_method.api_method_data_article_url",
    "aws_api_gateway_integration.api_integration_data_feed_categoryid_feedid",
    "aws_api_gateway_integration.api_integration_data_article_url"
  ]
}
