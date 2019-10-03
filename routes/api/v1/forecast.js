var router = require('express').Router();
var User = require('../../../models').User;

router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");

  User.findOne({
    where: { apiKey: req.body.api_key }
  })

  .then(user => {
    if (user) {
      // do the api requests
      res.status(200).send(JSON.stringify(user.apiKey));
    } else {
      payload = { error: 'Unauthorized',
                  status: 401,
                  message: 'Unauthorized.'};
      // return [401, payload];
      res.status(401).send(JSON.stringify(payload));
    }
  })

  .catch(error => {
    res.status(500).send({ error });
  })
});

module.exports = router;
