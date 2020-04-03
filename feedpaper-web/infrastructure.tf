variable "region" {}
variable "remote_state_bucket" {}
variable "remote_state_key" {}
variable "remote_state_region" {}
variable "bucket_site" {}
variable "route53_domain_name" {}
variable "route53_domain_zoneid" {}
variable "route53_domain_alias_name" {}
variable "route53_domain_alias_zoneid" {}

terraform {
  backend "local" {}
}

data "terraform_remote_state" "remote_state" {
  backend = "s3"
  config = {
    bucket = var.remote_state_bucket
    key    = var.remote_state_key
    region = var.remote_state_region
  }
}

provider "aws" {
    region = var.region
    version = "2.54.0"
}

resource "aws_s3_bucket" "site" {
    bucket = var.bucket_site
    acl = "public-read"
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
      "Resource": "arn:aws:s3:::${var.bucket_site}/*",
      "Principal": "*"
    }
  ]
}
EOF
    website {
        index_document = "index.html"
        error_document = "error.html"
    }
    tags = {
        project = "feedpaper"
    }
    force_destroy = true
}

resource "aws_route53_record" "domain" {
   name = var.route53_domain_name
   zone_id = var.route53_domain_zoneid
   type = "A"
   alias {
     name = var.route53_domain_alias_name
     zone_id = var.route53_domain_alias_zoneid
     evaluate_target_health = true
   }
}
