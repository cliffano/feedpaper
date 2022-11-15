variable "region" {}
variable "bucket_site" {}
variable "route53_domain_name" {}
variable "route53_domain_zoneid" {}
variable "acm_certificate_arn" {}
variable "s3_bucket_cdn_log" {}

terraform {
  backend "s3" {}
}

provider "aws" {
    region = var.region
    version = "4.39.0"
}

module "kon_tiki" {
  source                       = "git::https://github.com/cliffano/terraform-kon-tiki.git?ref=main"
  acm_certificate_arn          = var.acm_certificate_arn
  route53_domain               = var.route53_domain_name
  route53_zone_id              = var.route53_domain_zoneid
  s3_bucket_cdn_log            = var.s3_bucket_cdn_log
  s3_bucket_site               = var.bucket_site
  enable_s3_bucket_extras      = false
  enable_lambda_viewer_request = false
  enable_lambda_origin_request = false
  region                       = var.region
  tags = {
    project = "feedpaper"
  }
}