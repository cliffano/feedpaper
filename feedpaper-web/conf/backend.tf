variable "remote_state_bucket" ""
variable "remote_state_key" ""
variable "remote_state_region" ""

terraform {
  backend "s3" {
    bucket = "${var.remote_state_bucket}"
    key    = "${var.remote_state_key}"
    region = "${var.remote_state_region}"
  }
}
