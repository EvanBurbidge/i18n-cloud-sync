//Handle http basic auth

const auth = require('basic-auth');
const { username, password } = require('./io-methods');

let admins = {}

if ( username ) {
  admins[username] = { password }
}

module.exports = function(req, res, next) {
  if ( username === undefined ) {
    // not using auth
    return next()
  }
  const user = auth(req);
  if ((!user || !admins[user.name] || admins[user.name].password !== user.pass) && (req.url != '/' || req.url != '/health')) {
    res.set('WWW-Authenticate', 'Basic realm="sofe-deplanifester"')
    return res.status(401).send()
  }
  return next()
};
