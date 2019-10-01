var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var User = require('../../../models').User;
var srs = require('secure-random-string');

/* Post new user */
router.post('/', function(req, res, next) {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    res.setHeader("Content-Type", "application/json");

    if (req.body.email == '') {
      payload = {
        error: 'EmailCannotBeEmpty',
        status: 400,
        message: 'Email cannot be empty.'
      }
      res.status(400).send(JSON.stringify(payload));
    } else if (req.body.password == '') {
      payload = {
        error: 'PasswordCannotBeEmpty',
        status: 400,
        message: 'Password cannot be empty.'
      }
      res.status(400).send(JSON.stringify(payload));
    }

    User.create({
      email: req.body.email,
      password: hash,
      api_key: srs()
    })

    .then(user => {
      payload = {api_key: user.api_key};
      res.status(201).send(JSON.stringify(payload));
    })

    .catch(error => {
      res.status(500).send({ error });
    });
  });
});

module.exports = router;
