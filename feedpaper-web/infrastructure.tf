variable "bucket_site" {}

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
    tags {
        project = "feedpaper"
    }
    force_destroy = true
}
