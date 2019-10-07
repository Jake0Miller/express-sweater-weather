var router = require('express').Router();
var User = require('../../../../models').User;
var Location = require('../../../../models').Location;
var FavoriteLocation = require('../../../../models').FavoriteLocation;
const fetch = require('node-fetch');

router.post('/', function(req, res, next) {
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

router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");

  User.findOne({ where: { apiKey: req.body.api_key } })

  .then(user => {

    if (user) {

      FavoriteLocation.findAll({where: {user_id: user.id}})

      .then(favs => {

        if (favs) {

          let locs = [];

          favs.forEach(fav => {
            locs.push(fav.location_id);
          });

          Location.findAll({where: {id: locs}})

          .then(async locations => {
            let results = [];

            for (i = 0; i < locations.length; i++) {
              let loc = locations[i];

              let result = await fetch(`https://api.darksky.net/forecast/${process.env.DARK_SKY}/${loc.lat},${loc.lng}`);
              result = await result.json();

              let this_loc = loc.location.split(",");
              let city = this_loc[0]
              city = city[0].toUpperCase() + city.slice(1);
              let state = this_loc[1].toUpperCase();

              let currently = (({ summary,
                icon,
                precipIntensity,
                precipProbability,
                temperature,
                humidity,
                pressure,
                windSpeed,
                windGust,
                windBearing,
                cloudCover,
                visibility }) =>
                ({ summary,
                  icon,
                  precipIntensity,
                  precipProbability,
                  temperature,
                  humidity,
                  pressure,
                  windSpeed,
                  windGust,
                  windBearing,
                  cloudCover,
                  visibility }))(result['currently']);

              let payload = { location: `${city}, ${state}`,
                              current_weather: currently };

              results.push(payload);
            }

            return results

          })

          .then(payload => res.status(200).send(payload))

        } else {

          res.status(200).send('User has no favorites.')

        }

      })

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
