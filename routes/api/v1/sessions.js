var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var User = require('../../../models').User;

router.post('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");

  User.findOne({
    where: { email: req.body.email }
  })

  .then(user => {
    let payload;
    let status;

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        status = 201;
        payload = { api_key: user.api_key }
      } else {
        status = 400
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

});

module.exports = router;
