variable "account_id" {
  description = "Billing account ID"
}

variable "region" {
  description = "AWS Region"
}

variable "application" {
  description = "Application name"
  default     = "play-datapipeline-kinesis"
}

module "kinesis" {
  source = "./kinesis"
}

module "db" {
  source = "./db"

  application = "${var.application}"
}

module "process" {
  source = "./process"

  account_id  = "${var.account_id}"
  region      = "${var.region}"
  application = "${var.application}"

  stream_arn = "${module.kinesis.test_stream_arn}"
}
