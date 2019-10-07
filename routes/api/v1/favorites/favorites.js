var router = require('express').Router();
var User = require('../../../../models').User;
var Location = require('../../../../models').Location;
var FavoriteLocation = require('../../../../models').FavoriteLocation;
const fetch = require('node-fetch');

router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");

  User.findOne({ where: { apiKey: req.body.api_key } })

  .then(user => {

    if (user) {

      Location.findOne({ where: { location: req.body.location } })

      .then(location => {

        if (location) {

          return location

        } else {

          return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.location}&key=${process.env.GEO_KEY}`)
          .then(response => response.json())
          .then(result => {
            coords = { location: req.body.location,
                       lat: result['results'][0]['geometry']['location']['lat'],
                       lng: result['results'][0]['geometry']['location']['lng'] }
            return Location.create(coords)
          })

        }

      })

      .then(location => FavoriteLocation.create({user_id: user.id, location_id: location.id}))

      .then(fav => res.status(200).send({message: `${req.body.location} has been added to your favorites`}))

      .catch(error => res.status(500).send({ error }) )

    } else {

      let payload = { error: 'Unauthorized',
                      status: 401,
                      message: 'Unauthorized.'};
      res.status(401).send(payload);

    }

  })

  .catch(error => res.status(500).send({ error }) )
});

module.exports = router;
