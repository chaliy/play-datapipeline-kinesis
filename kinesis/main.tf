resource "aws_kinesis_stream" "test" {
  name             = "kinesis-test"
  shard_count      = 1
  retention_period = 48

  shard_level_metrics = [
    "IncomingBytes",
    "OutgoingBytes",
  ]

  tags {
    Environment = "test"
  }
}

output "test_stream_arn" {
  value = "${aws_kinesis_stream.test.arn}"
}
