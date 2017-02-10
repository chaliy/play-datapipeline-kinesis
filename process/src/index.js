'use strict';
let co = require('co');
let omit = require('lodash.omit');

let AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();
let denodeify = require('denodeify');
let put = denodeify(dynamo.put.bind(dynamo));
let get = denodeify(dynamo.get.bind(dynamo));
let update = denodeify(dynamo.update.bind(dynamo));

let md5 = require('md5');

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
      let entryHash = md5(JSON.stringify({
        type: entry.type,
        timestamp: entry.timestamp
      }));
      entry = Object.assign(entry, { hash: entryHash });

      try {

        let product = yield getProduct(sn);

        if (product.sn /* Product exists */) {
          
          if ((product.lifecycle || []).find(e => e.hash === entryHash)){
            // Report duplicate
            console.log('[WARN] Lifecycle deduplicated', sn, entryHash, JSON.stringify(entry));
            continue;
          }
          yield addEntry(sn, entry);
          
        } else {
          yield putProduct(sn, entry);
        }

        console.log('[INFO] Added lifecycle', sn, JSON.stringify(entry));
      } catch (ex) {
        console.log('[ERROR] Lifecycle add failed', sn, JSON.stringify(entry), ex);
      }
    }
  })
  .then(context.succeed)
  .catch(context.fail);
};
