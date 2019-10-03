var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var User = require('../../../models').User;
var checkBody = require("./login").checkBody;

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
      let payload;
      let status;

      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          status = 200;
          payload = { api_key: user.apiKey }
        } else {
          status = 401
          payload = { error: 'EmailOrPasswordIncorrect',
          status: 401,
          message: 'Email or password is incorrect.'}
        };
      } else {
        status = 401
        payload = { error: 'EmailOrPasswordIncorrect',
        status: 401,
        message: 'Email or password is incorrect.'}
      }
      res.status(status).send(JSON.stringify(payload));
    })

    .catch(error => {
      res.status(500).send({ error });
    });
  }
});

module.exports = router;
