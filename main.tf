variable "account_id" {
  description = "Billing account ID"
}

variable "region" {
  description = "AWS Region"
}

module "kinesis" {
  source = "./kinesis"
}
