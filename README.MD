# AWS Kinesis Serverless Demo Application

Application demoes data pipline Producer > AWS Kinesis > AWS Lambda > AWS DynamoDb.

## Scenario

Product lifecycle database. During product lifecycle some events are generated. Applicaiton will process them and build some analytics.

## Technical Overview

Application uses AWS Kinesis as input queue, it uses 48 hours of retention making it effectivelly peresisten queue. Processing is done using AWS Lambda. Storage is AWS DynamoDb. 

![Cartton](/docs/cartoon.png)

## How run

- Ensure dependecies: `nodejs`, `terraform`, `make`
- export `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- add `terraform.tfvars` with `region` and `account_id`
- run `make apply`

# License

MIT