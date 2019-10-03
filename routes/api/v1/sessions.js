var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var User = require('../../../models').User;
var checkBody = require("./login").checkBody;
// var tryLogin = require("./login").tryLogin;

router.post('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var payload = checkBody(req.body);
  if (payload) {
    res.status(400).send(JSON.stringify(payload));
  } else {
    User.findOne({
      where: { email: req.body.email }
    })

    .then(user => {
      response = tryLogin(user, req.body)
      res.status(response[0]).send(JSON.stringify(response[1]));
    })

    .catch(error => {
      res.status(500).send({ error });
    });
  }
});

function tryLogin(user, body) {
  var payload;
  if (user) {
    if (bcrypt.compareSync(body.password, user.password)) {
      payload = { api_key: user.apiKey };
      return [200, payload];
    } else {
      payload = { error: 'EmailOrPasswordIncorrect',
                  status: 401,
                  message: 'Email or password is incorrect.'};
      return [401, payload];
    };
  } else {
    payload = { error: 'EmailOrPasswordIncorrect',
                status: 401,
                message: 'Email or password is incorrect.'};
    return [401, payload];
  }
}

module.exports = router;
