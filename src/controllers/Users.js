const { Users } = require('../models')
const createToken = require('../utils/jwt')
const bcrypt = require('bcrypt')
const { verify } = require('jsonwebtoken')

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: {
        exclude: ['password']
      }
    })
    res.status(200).json({ success: true, users })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

exports.register = async (req, res) => {
  const { username, password, confirmPassword, email } = req.body
  try {
    if (password !== confirmPassword) return res.json({ success: false, errors: 'Пароли не совпадают' })
    const user = await Users.findOne({
      where: {
        email: email
      }
    })
    if (user) return res.json({ success: false, errors: 'Пользователь с таким email уже существует' })
    const hashPassword = await bcrypt.hash(password, 5)

    const newUser = await Users.create({
      username,
      email,
      password: hashPassword
    })

    const token = createToken(newUser)
    res.cookie('token', token, { maxAge: 60 * 60 * 24 * 1000, httpOnly: true })
    return res.json({ success: true, token })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

exports.login = async (req, res) => {
  const { password, email } = req.body
  try {
    const user = await Users.findOne({
      where: {
        email: email
      }
    })
    if (!user) return res.json({ success: false, errors: 'Пользователь не найден' })
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) return res.json({ success: false, errors: 'Пароль не верный' })

    const token = createToken(user)

    res.cookie('token', token, { maxAge: 60 * 60 * 24 * 1000 })

    return res.json({ success: true, token })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

exports.getUser = async (req, res) => {
  try {
    const token = req.headers.cookie?.split('=')[ 1 ]
    const userdata = verify(token, 'секретныйключкоторыйнужнохранитьнетутноэтопетпроект')
    const user = await Users.findAll({
      limit: 1,
      where: { email: userdata.email },
      attributes: {
        exclude: ['password']
      }
    })
    res.json({ user: user[0] })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
