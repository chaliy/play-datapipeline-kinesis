const aws = require('aws-sdk');
const credentials = new aws.EnvironmentCredentials('AWS');
aws.config.credentials = credentials;
aws.config.region = 'eu-west-1';

module.exports = aws;
