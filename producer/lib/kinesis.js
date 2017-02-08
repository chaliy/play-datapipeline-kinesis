const aws = require('./aws');
const kinesis = new aws.Kinesis();

module.exports.putRecord = (...args) => kinesis.putRecord(...args).promise();
module.exports.putRecords = (...args) => kinesis.putRecords(...args).promise();
