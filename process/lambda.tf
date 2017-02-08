data "archive_file" "function" {
  type        = "zip"
  source_dir  = "${path.module}/dist"
  output_path = "${path.module}/function.zip"
}

resource "aws_iam_role" "default" {
  name = "${var.application}-${var.function_name}-iam-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "cloudwatch-logs-access" {
  name = "${var.application}-${var.function_name}-cloudwatch-logs-access-policy"
  role = "${aws_iam_role.default.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": "logs:CreateLogGroup",
        "Resource": "arn:aws:logs:${var.region}:${var.account_id}:*"
    },
    {
        "Effect": "Allow",
        "Action": [
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
        "Resource": [
            "arn:aws:logs:${var.region}:${var.account_id}:log-group:/aws/lambda/${var.application}-${var.function_name}:*"
        ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "kinesis-access" {
  name = "${var.application}-${var.function_name}-kinesis-access-policy"
  role = "${aws_iam_role.default.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "kinesis:DescribeStream",
        "kinesis:ListStreams",
        "kinesis:GetShardIterator",
        "kinesis:GetRecords",
        "kinesis:ListTagsForStream"
      ],
      "Effect": "Allow",
      "Resource": [
        "*"
      ],
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "dynamodb-products-access" {
  name = "${var.application}-${var.function_name}-dynamodb-products-access-policy"
  role = "${aws_iam_role.default.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["dynamodb:*"],
      "Resource": "arn:aws:dynamodb:${var.region}:${var.account_id}:table/${var.application}-products"
    }
  ]
}
EOF
}

resource "aws_lambda_function" "process" {
  filename         = "${data.archive_file.function.output_path}"
  function_name    = "${var.application}-${var.function_name}"
  role             = "${aws_iam_role.default.arn}"
  timeout          = 10
  handler          = "index.handler"
  runtime          = "nodejs4.3"
  source_code_hash = "${data.archive_file.function.output_base64sha256}"
}

resource "aws_lambda_event_source_mapping" "kinesis" {
  batch_size        = 100
  event_source_arn  = "${var.stream_arn}"
  enabled           = true
  function_name     = "${aws_lambda_function.process.arn}"
  starting_position = "TRIM_HORIZON"
}

output "process_arn" {
  value = "${aws_lambda_function.process.arn}"
}
