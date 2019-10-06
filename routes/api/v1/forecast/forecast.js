var router = require('express').Router();
var User = require('../../../../models').User;
var Location = require('../../../../models').Location;
const fetch = require('node-fetch');

router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");

  User.findOne({ where: { apiKey: req.body.api_key } })

  .then(user => {
    if (user) {
      console.log('Step 1')
      Location.findOne({ where: { location: req.query.location } })

      .then(location => {
        var coords;

        if (location) {
          console.log('Step 2a')
          coords = location
          return coords
        } else {
          console.log('Step 2b')
          return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.location}&key=${process.env.GEO_KEY}`)
          .then(response => response.json())
          .then(result => {
            coords = { location: req.query.location,
                       lat: result['results'][0]['geometry']['location']['lat'],
                       lng: result['results'][0]['geometry']['location']['lng'] }
            return coords
          })
        }
      })
      .then(coords => {
        console.log('Step 3')
        console.log(coords)
        return fetch(`https://api.darksky.net/forecast/${process.env.DARK_SKY}/${coords['lat']},${coords['lng']}`)
      })
      .then(response => response.json())
      .then(forecast => {
        let loc = req.query.location.split(",");
        let city = loc[0]
        city = city[0].toUpperCase() + city.slice(1);
        let state = loc[1].toUpperCase();
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
            visibility }))(forecast['currently']);

        payload = { location: `${city}, ${state}`,
        currently: currently,
        hourly: forecast['hourly'],
        daily: forecast['daily'] }

        res.status(200).send(JSON.stringify(payload))
      })
    .catch(error => res.status(501).send({ error }) )

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
