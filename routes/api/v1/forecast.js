var express = require('express');
var router = express.Router();
var User = require('../../../models').User;

router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  console.log('Step 1')
  User.findOne({
    where: { apiKey: req.body.api_key }
  })

  .then(user => {
    console.log('Step 2')
    if (user) {
      console.log('Step 3')
      res.status(200).send(JSON.stringify(user.apiKey));
    } else {
      console.log('Step 4')
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
