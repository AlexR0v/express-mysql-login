const { sign } = require('jsonwebtoken')

const createToken = user => {
  return sign(
    { email: user.email, id: user.id },
    'секретныйключкоторыйнужнохранитьнетутноэтопетпроект')
}

module.exports = createToken
