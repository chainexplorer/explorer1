var request = require('request');

var base_url = 'https://stocks.exchange/api2/';

function getMarketSummary(coin, exchange, cb) {
  var req_url = base_url + '/market_summary/' + coin + '/' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (body.message) {
        return cb(body.message, null)
      } else {
        return cb (null, body[coin + '/' + exchange]);
      }
    }
  });
}

function getTradeHistoryPublic(coin, exchange, cb) {
  var req_url = base_url + '/trades?pair=' + coin + '_' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (body.message) {
        return cb(body.message, null)
      } else {
        return cb (null, body[coin + '_' + exchange]);
      }
    }
  });
}

function getOrderBook(coin, exchange, cb) {
  var req_url = base_url + '/orderbook?pair=' + coin + '_' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (body.success == 0) {
      return cb(body.error, null, null);
    } else {
      return cb(null, body[coin + '_' + exchange]['buy'], body[coin + '_' + exchange]['sell']);
    }
  });
}

module.exports = {
  get_data: function(coin, exchange, cb) {
    var error = null;
    get_orders(coin, exchange, function(err, buys, sells) {
      if (err) { error = err; }
      get_trades(coin, exchange, function(err, trades) {
        if (err) { error = err; }
        get_summary(coin, exchange, function(err, stats) {
          if (err) { error = err; }
          return cb(error, {buys: buys, sells: sells, chartdata: [], trades: trades, stats: stats});
        });
      });
    });
  }
};