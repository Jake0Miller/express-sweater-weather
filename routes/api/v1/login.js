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

function tryLogin(user, body) {
  var payload;
  if (user) {
    if (bcrypt.compareSync(body.password, user.password)) {
      payload = { api_key: user.apiKey };
      return [200, payload];
    } else {
      payload = { error: 'EmailOrPasswordIncorrect',
                  status: 401,
                  message: 'Email or password is incorrect.'};
      return [401, payload];
    };
  } else {
    payload = { error: 'EmailOrPasswordIncorrect',
                status: 401,
                message: 'Email or password is incorrect.'};
    return [401, payload];
  }
}

module.exports = {checkBody: checkBody,
                  tryLogin: tryLogin}
