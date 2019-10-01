var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var User = require('../../../models').User;

/* Post new user */
router.post('/', function(req, res, next) {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    User.create({
      email: req.body.email,
      password: hash,
      api_key: 0
    })
    .then(user => {
      res.setHeader("Content-Type", "application/json");
      res.status(201).send(JSON.stringify({"api_key": user.api_key}));
    })
    .catch(error => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({ error });
    });
  });
});

module.exports = router;
