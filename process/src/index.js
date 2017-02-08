'use strict';
// const AWS = require('aws-sdk');
// const dynamo = new AWS.DynamoDB.DocumentClient();
// const denodeify = require('denodeify');
// const put = denodeify(dynamo.put.bind(dynamo));

let processRecord = record => {
  let data = JSON.parse(new Buffer(record.kinesis.data, 'base64').toString('utf8'));
  console.log(data);
  return Promise.resolve(data);
};

exports.handler = (event, context) => {
  Promise
    .all(event.Records.map(processRecord))
    .then(context.succeed)
    .catch(context.fail);
};
