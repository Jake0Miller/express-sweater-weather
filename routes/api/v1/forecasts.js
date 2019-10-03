var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");

  User.findOne({
    where: { apiKey: req.body.api_key }
  })

  .then(user => {
    if (user) {
      var apiKey = user.apiKey;
    } else {
      payload = { error: 'EmailOrPasswordIncorrect',
                  status: 401,
                  message: 'Email or password is incorrect.'};
      return [401, payload];
    }
  })

  .catch(error => {
    res.status(500).send({ error });
  })
});

module.exports = router;
