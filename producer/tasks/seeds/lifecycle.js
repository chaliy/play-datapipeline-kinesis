const co = require('co');
const uuid = require('uuid').v4;
const put = require('../../lib/put');

const faker = require('faker');
const types = [
  'Service', 'Warranty', 'Note', 'Theft', 'Incendent'
];

const products = require('../../data/products.json');

co(function*() {
  for (let i = 0; i < 100; i++) {
    const product = faker.random.arrayElement(products);
    const type = faker.random.arrayElement(types);

    const response = yield put({
      Data: JSON.stringify({
        type: type,
        timestamp: new Date(),
        sn: product.serialNumber,
        countryCode: faker.address.countryCode()
      }),
      PartitionKey: uuid(),
      StreamName: 'kinesis-test'
    });
    console.log(response);
  }
})
.catch(console.log);
