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

module.exports = {checkBody: checkBody}
