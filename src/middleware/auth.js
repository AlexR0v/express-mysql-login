const { verify } = require('jsonwebtoken')

const auth = async (req, res, next) => {
  try {
    //const token = req.headers.authorization.split(' ')[ 1 ]
    // const isCustomAuth = token.length < 500
    //
    // let decodedData
    //
    // if (token && isCustomAuth) {
    //   decodedData = jwt.verify(token, process.env.SECRET_KEY)
    //
    //   req.userId = decodedData?.id
    // } else {
    //   decodedData = jwt.decode(token)
    //
    //   req.userId = decodedData?.sub
    // }
    const token = req.headers.cookie?.split('=')[ 1 ]
    if (!token) return res.status(403).json('Пользователь не авторизован')
    const user = verify(token, 'секретныйключкоторыйнужнохранитьнетутноэтопетпроект')
    if (token) {
      req.authenticated = true
      return next()
    }
  } catch (error) {
    return res.status(500).json({ error })
  }
}

module.exports = auth
