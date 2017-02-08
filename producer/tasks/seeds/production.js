const co = require('co');
const uuid = require('uuid').v4;
const put = require('../../lib/put');

const faker = require('faker');
const rnd = (min, max) => Math.floor(Math.random() * (max - min) + min);
const range = max => Array(max).fill();
const rndItems = arr => range(rnd(2, 7)).map(i => faker.random.arrayElement(arr));
const rndToBe = () => (rnd(0, 10000)/10000)>0.5;
const rndMoreToBe = () => (rnd(0, 10000)/10000)>0.2;

const sites = [
  'Austin Production', 'Romania Assembly', 'Huaway OEM'
]

const products = require('../../data/products.json');

co(function*(){
  for(const product of products){
    const response = yield put({
      Data: JSON.stringify(Object.assign({
        type: 'Production',
        timestamp: new Date()
      }, p)),
      PartitionKey: uuid(),
      StreamName: 'kinesis-test'
    });
    console.log(response);
  }
})
.catch(console.log);