// Generate lifecicle entries. Just run it as `node lifecycle.js`
const co = require('co');
const _ = require('lodash');
const uuid = require('uuid').v4;
const putRecords = require('../../lib/kinesis').putRecords;

const faker = require('faker');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const types = [
  'Service', 'Warranty', 'Note', 'Theft', 'Incendent'
];

const products = require('../../data/products.json');

const generate = () => {
  const product = faker.random.arrayElement(products);
  const type = faker.random.arrayElement(types);

  return {
    type: type,
    timestamp: new Date(),
    sn: product.serialNumber,
    countryCode: faker.address.countryCode()
  };
};

// const batch = () => co(function*() {
//   const records = _.range(_.random(20, 400)).map(generate);

//   return yield putRecords({
//     Records: records.map(record => ({
//       Data: JSON.stringify(record),
//       PartitionKey: uuid()
//     })),
//     StreamName: 'play-datapipeline-kinesis-products-lifecycle-stream'
//   });
// })
// .catch(console.log);

// co(function*() {
//   while (true) {
//     let response = yield batch();
//     console.log('Batch with', response.Records.length, 'at', new Date());
//     yield sleep(_.random(1000, 10000));
//   }
// })
// .then(console.log)
// .catch(console.log);


co(function*() {
  const records = _.range(5).map(generate);

  return yield putRecords({
    Records: records.map(record => ({
      Data: JSON.stringify(record),
      PartitionKey: uuid()
    })),
    StreamName: 'play-datapipeline-kinesis-products-lifecycle-stream'
  });
})
.then(console.log)
.catch(console.log)