const co = require('co');
const uuid = require('uuid').v4;
const put = require('../../lib/put');

const faker = require('faker');
// const rnd = (min, max) => Math.floor(Math.random() * (max - min) + min);
// const range = max => Array(max).fill();
// const rndItems = arr => range(rnd(2, 7)).map(i => faker.random.arrayElement(arr));
// const rndToBe = () => (rnd(0, 10000)/10000)>0.5;
// const rndMoreToBe = () => (rnd(0, 10000)/10000)>0.2;

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
        serialNumber: product.serialNumber,
        country: faker.address.countryCode()
      }),
      PartitionKey: uuid(),
      StreamName: 'kinesis-test'
    });
    console.log(response);
  }
})
.catch(console.log);
