var router = require('express').Router();
var User = require('../../../../models').User;
const fetch = require('node-fetch');

router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");

  User.findOne({
    where: { apiKey: req.body.api_key }
  })

  .then(user => {
    if (user) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.location}&key=${process.env.GEO_KEY}`)
      .then(response => response.json())
      .then(payload => res.status(200).send(JSON.stringify(payload)))
      .catch(error => res.status(500).send({ error }))
    } else {
      let payload = { error: 'Unauthorized',
                      status: 401,
                      message: 'Unauthorized.'};
      res.status(401).send(payload);
    }
  })

  .catch(error => { res.status(500).send({ error }) })
});

module.exports = router;
