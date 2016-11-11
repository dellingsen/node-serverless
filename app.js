var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Use Express web app framework for routing
var app = express();

app.use(logger('dev'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

//Create Http Server to listen for requests to routes
var server = app.listen(4000, function () {
  console.log('Listening on port', server.address().port)
})

module.exports = app;
