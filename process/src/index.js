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

let getProduct = sn => co(function*() {
  return (yield get({
    TableName: DB_TABLE,
    Key: { sn: sn }
  })).Item || {};
});

let addEntry = (sn, entry) => co(function*() {
  yield update({
    TableName: DB_TABLE,
    Key: { sn: sn },
    UpdateExpression: 'set lifecycle = list_append(lifecycle, :entry)',
    ExpressionAttributeValues: {
      ':entry': [entry]
    }
  });
});

let putProduct = (sn, entry) => co(function*() {
  yield put({
    TableName: DB_TABLE,
    Item: {
      sn: sn,
      lifecycle: [
        entry
      ]
    }
  });
});

exports.handler = (event, context) => {
  co(function*() {
    for (let record of event.Records) {
      let payload = JSON.parse(new Buffer(record.kinesis.data, 'base64').toString('utf8'));

      let sn = payload.sn;
      let entry = omit(payload, 'sn');

      let product = yield getProduct(sn);

      if (product.sn /* Product exists */) {
        yield addEntry(sn, entry);
      } else {
        yield putProduct(sn, entry);
      }

      console.log('Added lifecycle', sn, JSON.stringify(entry));
    }
  })
  .then(context.succeed)
  .catch(context.fail);
};
