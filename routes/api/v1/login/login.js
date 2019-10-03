var User = require('../../../../models').User;
const bcrypt = require('bcrypt');

function checkBody(body) {
  var payload;
  if (body.email == null || body.email == '') {
    payload = { error: 'EmailCannotBeEmpty',
                status: 400,
                message: 'Email cannot be empty.' }
  } else if (body.password == null || body.password == '') {
    payload = { error: 'PasswordCannotBeEmpty',
                status: 400,
                message: 'Password cannot be empty.' }
  }
  return payload
}

function tryLogin(body, callback) {
  User.findOne({
    where: { email: body.email }
  })

  .then(user => {
    if (user) {
      if (bcrypt.compareSync(body.password, user.password)) {
        return callback([200, { api_key: user.apiKey }]);
      } else {
        let payload = { error: 'EmailOrPasswordIncorrect',
                    status: 401,
                    message: 'Email or password is incorrect.'};
        return callback([401, payload]);
      };
    } else {
      let payload = { error: 'EmailOrPasswordIncorrect',
                  status: 401,
                  message: 'Email or password is incorrect.'};
      return callback([401, payload]);
    }
  })

  .catch(error => { return callback([500, error]); });
}

module.exports = {checkBody: checkBody,
                  tryLogin: tryLogin}
