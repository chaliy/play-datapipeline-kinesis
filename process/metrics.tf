resource "aws_cloudwatch_log_metric_filter" "lifecycles" {
  name           = "product-lifecycles-count"
  pattern        = "\"Added lifecycle\""
  log_group_name = "/aws/lambda/${var.application}-${var.function_name}"

  metric_transformation {
    name      = "${var.application}-${var.function_name}-lifecycles-count"
    namespace = "${var.application}-${var.function_name}"
    value     = "1"
  }
}
