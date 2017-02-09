resource "aws_dynamodb_table" "products" {
  name           = "${var.application}-products"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "sn"

  attribute {
    name = "sn"
    type = "S"
  }
}
