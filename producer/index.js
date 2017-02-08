const co = require('co');
const uuid = require('uuid').v4;
const aws = require('aws-sdk');
const credentials = new aws.EnvironmentCredentials('AWS');
aws.config.credentials = credentials;
aws.config.region = 'eu-west-1';

const kinesis = new aws.Kinesis();
 

const putRecord = (...args) => kinesis.putRecord(...args).promise();

co(function*(){
  const response = yield putRecord({
    Data: 'test',
    PartitionKey: uuid(),
    StreamName: 'kinesis-test'
  });
  console.log(response);
}).catch(console.log);