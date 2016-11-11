'use strict';

// Require the AWS SDK and get the instance of our DynamoDB
var aws = require('aws-sdk');
var db = new aws.DynamoDB();

// Set up the model for our the email
var model = {
  username: {"S" : ""},
};

// This will be the function called when our Lambda function is exectued
exports.handler = (event, context, callback) => {

  // We'll use the same response we used in our Webtask
  const RESPONSE = {
    OK : {
      statusCode : 200,
      message: "You have successfully added the username.",
    },
    DUPLICATE : {
      status : 400,
      message : "Username already exists."
    },
    ERROR : {
      status : 400,
      message: "Something went wrong. Please try again."
    }
  };

  // Capture the username from our POST request
  // For now, we'll just set a fake username
  var username = event.body.username;

  if(!username){
    // If we don't get an username, we'll end our execution and send an error
    return callback(null, RESPONSE.ERROR);
  }

  // If we do have an email, we'll set it to our model
  model.username.S = username;

  // Insert the username into the database, but only if the username does not already exist.
  db.putItem({
    TableName: 'Users',
    Item: model,
    Expected: {
      username: { Exists: false }
    }
  }, function (err, data) {
    if (err) {
      // If we get an err, we'll assume it's a duplicate username and send an
      // appropriate message
      return callback(null, RESPONSE.DUPLICATE);
    }
    // If the data was stored succesfully, we'll respond accordingly
    callback(null, RESPONSE.OK);
  });
};