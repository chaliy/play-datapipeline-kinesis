resource "aws_iam_role" "default" {
  name = "${var.application}-kinesis-analytics-iam-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "kinesisanalytics.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "kinesis-analytics-access" {
  name = "${var.application}-kinesis-analytics-access-policy"
  role = "${aws_iam_role.default.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Sid": "ReadInputKinesis",
        "Effect": "Allow",
        "Action": [
            "kinesis:DescribeStream",
            "kinesis:GetShardIterator",
            "kinesis:GetRecords"
        ],
        "Resource": [
            "arn:aws:kinesis:${var.region}:${var.account_id}:stream/${var.application}-products-lifecycle-stream"
        ]
    }
  ]
}
EOF
}

# {
#         "Sid": "WriteOutputKinesis",
#         "Effect": "Allow",
#         "Action": [
#             "kinesis:DescribeStream",
#             "kinesis:PutRecord",
#             "kinesis:PutRecords"
#         ],
#         "Resource": [
#             "arn:aws:kinesis:eu-west-1:809493691190:stream/kinesis-analytics-placeholder-stream-destination"
#         ]
#     },
#     {
#         "Sid": "WriteOutputFirehose",
#         "Effect": "Allow",
#         "Action": [
#             "firehose:DescribeDeliveryStream",
#             "firehose:PutRecord",
#             "firehose:PutRecordBatch"
#         ],
#         "Resource": [
#             "arn:aws:firehose:eu-west-1:809493691190:deliverystream/kinesis-analytics-placeholder-firehose-destination"
#         ]
#     },
#     {
#         "Sid": "ReadInputFirehose",
#         "Effect": "Allow",
#         "Action": [
#             "firehose:DescribeDeliveryStream",
#             "firehose:Get*"
#         ],
#         "Resource": [
#             "arn:aws:firehose:eu-west-1:809493691190:deliverystream/kinesis-analytics-placeholder-firehose-source"
#         ]
#     },
#     {
#         "Sid": "ReadS3ReferenceData",
#         "Effect": "Allow",
#         "Action": [
#             "s3:GetObject"
#         ],
#         "Resource": [
#             "arn:aws:s3:::kinesis-analytics-placeholder-s3-bucket/kinesis-analytics-placeholder-s3-object"
#         ]
#     }

