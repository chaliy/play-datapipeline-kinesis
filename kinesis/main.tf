variable "application" {
  description = "Application name"
}

resource "aws_kinesis_stream" "products-lifecycle" {
  name             = "${var.application}-products-lifecycle-stream"
  shard_count      = 1
  retention_period = 48                                             # 2 days

  shard_level_metrics = [
    "IncomingBytes",
    "OutgoingBytes",
  ]

  tags {
    Application = "${var.application}"
  }
}

output "products_lifecycle_stream_arn" {
  value = "${aws_kinesis_stream.products-lifecycle.arn}"
}
