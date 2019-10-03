var express = require('express');
var router = express.Router();
var User = require('../../../../models').User;
const bcrypt = require('bcrypt');
var srs = require('secure-random-string');
var checkBody = require("./account_creation").checkBody;
var findOrCreateUser = require("./account_creation").findOrCreateUser;

router.post('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var payload = checkBody(req.body);
  if (payload) {
    res.status(400).send(JSON.stringify(payload));
  } else {
    findOrCreateUser(req.body, function(response) {
      res.status(response[0]).send(JSON.stringify(response[1]));
    });
  }
});

module.exports = router;
