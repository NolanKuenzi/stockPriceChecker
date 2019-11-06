/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const MongoClient = require('mongodb').MongoClient;
const CONNECTION_STRING = process.env.DB;

chai.use(chaiHttp);

describe('Functional Tests', function() {
  this.timeout(10000);
  /* Clear DB */
  after(function () {
    MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }).then(function(db) {
      db.db('stockCollection').dropDatabase();
    }).catch(function(error) {
      console.log(error);
    })
  });
  it('1 stock', function() {
    return chai.request(server)
    .get('/api/stock-prices?')
    .query({stock: 'goog'})
    .then(function(res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.stockData.company, 'Alphabet, Inc.');
      assert.equal(res.body.stockData.stock, 'GOOG');
      assert.equal(res.body.stockData.likes, 0);
    });
  });
  it('1 stock with like', function() {
    return chai.request(server)
    .get('/api/stock-prices?')
    .query({stock: 'goog', like: 'true'})
    .then(function(res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.stockData.company, 'Alphabet, Inc.');
      assert.equal(res.body.stockData.stock, 'GOOG');
      assert.equal(res.body.stockData.likes, 1);
    });
  });
  it('1 stock with like again (ensure likes arent double counted)', function() {
    return chai.request(server)
    .get('/api/stock-prices?')
    .query({stock: 'goog', like: 'true'})
    .then(function(res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.stockData.company, 'Alphabet, Inc.');
      assert.equal(res.body.stockData.stock, 'GOOG');
      assert.equal(res.body.stockData.likes, 1);
    });
  });
  it('An unfound stock results in an error', function() {
    return chai.request(server)
    .get('/api/stock-prices?')
    .query({stock: 'oog'})
    .then(function(res) {
      const err = JSON.parse(res.text);
      assert.equal(res.status, 404);
      assert.equal(err.stockData.error, 'Stock: oog was not found');
    });
  });
  it('2 stocks - (GOOG has like from previous test & relative likes is shown)', function() {
    return chai.request(server)
    .get('/api/stock-prices?')
    .query({stock: ['goog', 'gm']})
    .then(function(res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.stockData[0].company, 'Alphabet, Inc.');
      assert.equal(res.body.stockData[0].stock, 'GOOG');
      assert.equal(res.body.stockData[0].likes, 1);
      assert.equal(res.body.stockData[1].company, 'General Motors Co.');
      assert.equal(res.body.stockData[1].stock, 'GM');
      assert.equal(res.body.stockData[1].likes, -1);
    })   
  });
  it('2 stocks with like (relative likes is shown)', function() {
    return chai.request(server)
    .get('/api/stock-prices?')
    .query({ stock: [ 'fb', 'gm' ], like: 'true' })
    .then(function(res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.stockData[0].company, 'Facebook, Inc.');
      assert.equal(res.body.stockData[0].stock, 'FB');
      assert.equal(res.body.stockData[0].likes, 0);
      assert.equal(res.body.stockData[1].company, 'General Motors Co.');
      assert.equal(res.body.stockData[1].stock, 'GM');
      assert.equal(res.body.stockData[1].likes, 0);
    })
  });
  it('2 stocks with like (GOOG has like from previous test, ensures likes arent double counted, & relative likes is shown, )', function() {
    return chai.request(server)
    .get('/api/stock-prices?')
    .query({stock: ['goog', 'gm'], like: 'true' })
    .then(function(res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.stockData[0].company, 'Alphabet, Inc.');
      assert.equal(res.body.stockData[0].stock, 'GOOG');
      assert.equal(res.body.stockData[0].likes, 0);
      assert.equal(res.body.stockData[1].company, 'General Motors Co.');
      assert.equal(res.body.stockData[1].stock, 'GM');
      assert.equal(res.body.stockData[1].likes, 0);
    })   
  });
  it('An unfound stock results in an error', function() {
    return chai.request(server)
    .get('/api/stock-prices?')
    .query({ stock: [ 'fb', 'kfc' ] })
    .then(function(res) {
      const err = JSON.parse(res.text);
      assert.equal(res.status, 404);
      assert.equal(err.stockData.error, 'Stock: kfc was not found');
    });
  });
});
