/*
*
*
*       Complete the API routing below
*
*
*/
'use strict';
const MongoClient = require('mongodb');
require('dotenv').config();
const CONNECTION_STRING = process.env.DB;
const { query } = require('express-validator');
const StockHandler = require('../controllers/stockHandler');

module.exports = function (app) {
  app.route('/api/stock-prices?')
    .get([
      query()
        .custom(function(undefined, queryObj) {
          if (typeof queryObj.req.query.stock === 'object') {
            queryObj.req.query.stock.forEach(function(item, idx) {
              queryObj.req.query.stock[idx] = queryObj.req.query.stock[idx].replace(/\s/g, ''); 
              queryObj.req.query.stock[idx] = escape(queryObj.req.query.stock[idx]);
            })
            return;
          }
          queryObj.req.query.stock = queryObj.req.query.stock.replace(/\s/g, '');
          queryObj.req.query.stock = escape(queryObj.req.query.stock);
        })
    ],
    function (req, res) {
      MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }).then(function(db) {
        const stockHandler = new StockHandler();
        const dataBase = db.db('stockCollection').collection('indvStocks');
        if (typeof req.query.stock === 'string') {
          return new Promise(function(resolve) {
            resolve(stockHandler.getStockData(req.query.stock));
          }).then(function(stockDta) {
            if (stockDta === 'error: 404 error' || stockDta === '"Unknown symbol"') {
              throw 'error: 404 error';
            }
            stockDta = JSON.parse(stockDta);
            return stockHandler.handleReqString(stockDta, req.query.like, req, res);
          }).catch(function(error) {
            if (error === 'error: 404 error') {
              res.status(404).json({stockData: {error: `Stock: ${req.query.stock} was not found`}});
              return;
            }
            res.status(500).json({stockData: {error: error}});
          })
        } else {
          return new Promise(function(resolve) {
            resolve(stockHandler.getStockData(req.query.stock[0]));
          }).then(function(stockDta0) {
            if (stockDta0 === 'error: 404 error' || stockDta0 === '"Unknown symbol"') {
              throw 'error: 404 error';
            }
            return new Promise(function(resolve) {
              resolve(stockHandler.getStockData(req.query.stock[1]));
            }).then(function(stockDta1) {
              if (stockDta1 === 'error: 404 error' || stockDta1 === '"Unknown symbol"') {
                throw 'error: 404 error';
              }
              stockDta0 = JSON.parse(stockDta0);
              stockDta1 = JSON.parse(stockDta1);
              return stockHandler.handleReqArr(stockDta0, stockDta1, req.query.like, req, res);
            }).catch(function(error) {
              if (error === 'error: 404 error') {
                throw 'error: 404 error1';
              }
              throw error;
            })
          }).catch(function(error) {
            if (error === 'error: 404 error' || error === 'error: 404 error1') {
              res.status(404).json({stockData: {error: error === 'error: 404 error' ? `Stock: ${req.query.stock[0]} was not found` : `Stock: ${req.query.stock[1]} was not found`}});
              return;
            }
            res.status(500).json({stockData: {error: error}});
          }) 
        } 
      }).catch(function(error) {
        res.status(500).json({stockData: {error: error}});
      });
    });
}