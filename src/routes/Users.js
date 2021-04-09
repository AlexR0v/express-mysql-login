const express = require('express')
const { getAllUsers, register, login, getUser } = require('../controllers/Users')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', getAllUsers)
router.get('/profile', auth, getUser)
router.post('/register', register)
router.post('/login', login)


module.exports = router
