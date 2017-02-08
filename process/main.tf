variable "account_id" {
  description = "Billing account ID"
}

variable "region" {
  description = "AWS Region"
}

variable "stream_arn" {
  description = "ARN of the Kinesis stream to connect"
}

variable "application" {
  description = "Application name"
  default     = "play-datapipeline-kinesis"
}

variable "function_name" {
  description = "Name of the dispatcher function"
  default     = "process"
}
