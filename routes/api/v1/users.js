var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var User = require('../../../models').User;
var srs = require('secure-random-string');
var checkBody = require("./account_creation").checkBody;
// var findOrCreateUser = require("./account_creation").findOrCreateUser;

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

function findOrCreateUser(body, callback) {
  User.findOne({ where: {email: body.email} })
  .then(user => {
    if (user) {
      let payload = { error: 'EmailAlreadyTaken',
                  status: 400,
                  message: 'Email has already been taken.' }
      return callback([400, payload]);
    } else {
      User.create({
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        apiKey: srs()
      })
      .then(user => { return callback([201, { api_key: user.apiKey }]); })
      .catch(error => { return callback([500, error]); });
    }
  })
  .catch(error => { return callback([500, error]); });
}

module.exports = router;
