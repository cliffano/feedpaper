terraform {
  backend "s3" {
    bucket = "feedpaper-tf-states"
    key    = "feedpaper/ci/feedpaper-api.tfstate"
    region = "ap-southeast-2"
  }
}
