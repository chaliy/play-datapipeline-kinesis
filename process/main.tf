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
}

variable "function_name" {
  description = "Name of the dispatcher function"
  default     = "process"
}

output "event_source_mapping_uuid" {
  value = "${aws_lambda_event_source_mapping.kinesis.uuid}"
}
