var router = require('express').Router();
const bcrypt = require('bcrypt');
var User = require('../../../../models').User;
var checkBody = require("./login").checkBody;
var tryLogin = require("./login").tryLogin;

router.post('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var payload = checkBody(req.body);
  if (payload) {
    res.status(400).send(JSON.stringify(payload));
  } else {
    tryLogin(req.body, function(response) {
      res.status(response[0]).send(JSON.stringify(response[1]));
    });
  }
});

module.exports = router;
