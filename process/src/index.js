'use strict';
let co = require('co');
let omit = require('lodash.omit');


let AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();
let denodeify = require('denodeify');
let put = denodeify(dynamo.put.bind(dynamo));
let get = denodeify(dynamo.get.bind(dynamo));
let update = denodeify(dynamo.update.bind(dynamo));

let DB_TABLE = 'play-datapipeline-kinesis-products';

exports.handler = (event, context) => {
  co(function*() {
    for (let record of event.Records) {
      let payload = JSON.parse(new Buffer(record.kinesis.data, 'base64').toString('utf8'));
      let sn = payload.sn;
      let entry = omit(payload, 'sn');
      let product = (yield get({
        TableName: DB_TABLE,
        Key: { sn: sn }
      })).Item || {};

      if (product.sn /* Product exists */) {
        yield update({
          TableName: DB_TABLE,
          Key: { sn: sn },
          UpdateExpression: 'set lifecycle = list_append(lifecycle, :entry)',
          ExpressionAttributeValues: {
            ':entry': [entry]
          }
        });
      } else {
        yield put({
          TableName: DB_TABLE,
          Item: {
            sn: sn,
            lifecycle: [
              entry
            ]
          }
        });
      }

      console.log('Added lifecycle', sn, JSON.stringify(entry));
    }
  })
  .then(context.succeed)
  .catch(context.fail);
};
