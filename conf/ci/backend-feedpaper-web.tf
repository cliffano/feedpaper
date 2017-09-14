terraform {
  backend "s3" {
    bucket = "feedpaper-tf-states"
    key    = "feedpaper/ci/feedpaper-web.tfstate"
    region = "ap-southeast-2"
  }
}
