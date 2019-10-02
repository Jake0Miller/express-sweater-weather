var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var User = require('../../../models').User;
var srs = require('secure-random-string');

router.post('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var status = 0;

  var payload = checkBody(req.body);

  if (payload) {
    res.status(400).send(JSON.stringify(payload));
  }

  User.findOne({
    where: { email: req.body.email }
  })

  .then(user => {
    if (user) {
      payload = { error: 'EmailAlreadyTaken',
                  status: 400,
                  message: 'Email has already been taken.' }
      res.status(400).send(JSON.stringify(payload));
    }
  })

  .catch(error => {
    res.status(500).send({ error });
  });

  bcrypt.hash(req.body.password, 10, function(err, hash) {
    User.create({ email: req.body.email,
                  password: hash,
                  api_key: srs() })

    .then(user => {
      payload = {api_key: user.api_key};
      res.status(201).send(JSON.stringify(payload));
    })

    .catch(error => {
      res.status(500).send({ error });
    });
  });
});

function checkBody(body) {
  var payload;

  if (body.email == '') {
    payload = { error: 'EmailCannotBeEmpty',
                status: 400,
                message: 'Email cannot be empty.' }
  } else if (body.password == '') {
    payload = { error: 'PasswordCannotBeEmpty',
                status: 400,
                message: 'Password cannot be empty.' }
  } else if (body.passwordConfirmation == '') {
    payload = { error: 'PasswordConfirmationCannotBeEmpty',
                status: 400,
                message: 'Password confirmation cannot be empty.' }
  } else if (body.passwordConfirmation != body.password) {
    payload = { error: 'PasswordsMustMatch',
                status: 400,
                message: 'Password and confirmation must match.' }
  }

  return payload
}

module.exports = router;
