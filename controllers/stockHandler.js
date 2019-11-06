const request = require('request');
const requestPromise = require('request-promise');
const MongoClient = require('mongodb');
require('dotenv').config();
const CONNECTION_STRING = process.env.DB;


function configStockDta(input, stkDta, like, req) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }).then(function(db) {
    const dataBase = db.db('stockCollection').collection('indvStocks');
    const ipAdd = req.headers['x-forwarded-for'] !== undefined ? req.headers['x-forwarded-for'] : req.connection.remoteAddress;
      if (input.length === 0) {
        const newStock = {company: stkDta.companyName, stock: stkDta.symbol, price: stkDta.latestPrice.toString(), likes: like === 'true' ? 1 : 0, ips: like === 'true' ? [ipAdd] : []};
        dataBase.insertOne(newStock).then(function(dtaBse) {
          resolve(newStock);
        }).catch(function(error) {
          reject(error);
        })
      } else {
        input[0].ips.forEach(item => {
          if (item === ipAdd) {
            like = 'false';
          } 
        });
        if (like === 'true') {
          input[0].likes = input[0].likes + 1;
          input[0].ips.push(ipAdd);
          dataBase.updateOne({stock: stkDta.symbol}, {$set: input[0]}).then(function(updated) {
            resolve(input[0]);
          }).catch(function(error) {
            reject(error);
          })
        } else {
          resolve(input[0]);
        }
      }
    }).catch(function(error) {
      return error;
    })
  }).catch(function(error) {
    return error;
  })
}

function StockHandler() {
  this.getStockData = function(input) {
    return new Promise(function(resolve) {
      resolve(requestPromise(`https://repeated-alpaca.glitch.me/v1/stock/${input}/quote`));
    }).catch(function(error) {
      return 'error: 404 error';
    })
  }
  this.handleReqString = function(stock_data, like, req, res) {
    MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }).then(function(db) {
      const dataBase = db.db('stockCollection').collection('indvStocks');
      dataBase.find({stock: stock_data.symbol}).toArray(function(error, result) {
        if (error) {
          res.status(500).json({stock_data: {error: error}});
          return;
        }
        return new Promise(function(resolve) {
          resolve(configStockDta(result, stock_data, like, req));
        }).then(function(rtrnData) {
          if (rtrnData.price === undefined) {
            throw rtrnData;
          }
          res.json({stockData: rtrnData});
        }).catch(function(error) {
          res.status(500).json({stock_data: {error: error}});
        })
      })
    }).catch(function(error) {
      res.status(500).json({stock_data: {error: error}});
    })
  };
  this.handleReqArr = function(stock_data0, stock_data1, like, req, res) {
    MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }).then(function(db) {
      const dataBase = db.db('stockCollection').collection('indvStocks');
      return new Promise(function(resolve) {
        dataBase.find({stock: stock_data0.symbol}).toArray(function(error, result) {
          if (error) {
            res.status(500).json({stock_data: {error: error}});
            return;
          }
          resolve(configStockDta(result, stock_data0, like, req));
        })
      }).then(function(stkData0) {
        return new Promise(function(resolve) {
          dataBase.find({stock: stock_data1.symbol}).toArray(function(error, result) {
            if (error) {
              res.status(500).json({stock_data: {error: error}});
              return;
            }
            resolve(configStockDta(result, stock_data1, like, req));
          })
        }).then(function(stkData1) {
          const sd0 = Object.assign({}, stkData0);
          const sd1 = Object.assign({}, stkData1);
          const sd0Likes = sd0.likes;
          sd0.likes = sd0.likes - sd1.likes;
          sd1.likes = sd1.likes - sd0Likes;
          res.json({stockData: [sd0, sd1]});
        }).catch(function(error) {
          res.status(500).json({stock_data: {error: error}});
        })
      }).catch(function(error) {
        res.status(500).json({stock_data: {error: error}});
      })
    }).catch(function(error) {
      res.status(500).json({stock_data: {error: error}});
    })
  };
};
module.exports = StockHandler;