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
  } else if (body.passwordConfirmation == null || body.passwordConfirmation == '') {
    payload = { error: 'PasswordConfirmationCannotBeEmpty',
                status: 400,
                message: 'Password confirmation cannot be empty.' }
  } else if (body.passwordConfirmation != body.password) {
    payload = { error: 'PasswordsMustMatch',
                status: 400,
                message: 'Password and confirmation must match.' }
  }
  return payload
}

function sayBye() {
  console.log("Ciao")
}

function focu(body) {
  findOrCreateUser(body, function(response) {
    console.log(response);
    res.status(response[0]).send(JSON.stringify(response[1]));
  });
}

function findOrCreateUser(body, callback) {
  console.log(body);
  User.findOne({ where: {email: body.email} })
  .then(user => {
    if (user) {
      let payload = { error: 'EmailAlreadyTaken',
                  status: 400,
                  message: 'Email has already been taken.' }
      return callback([400, payload]);
    } else {
      User.create({
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        apiKey: srs()
      })
      .then(user => { return callback([201, { api_key: user.apiKey }]); })
      .catch(error => { return callback([500, error]); });
    }
  })
  .catch(error => { return callback([500, error]); });
}

module.exports = {checkBody: checkBody,
                  focu: focu,
                  findOrCreateUser: findOrCreateUser}
