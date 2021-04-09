const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT ?? 5000
const app = express()

const db = require('./models')
const userRouter = require('./routes/Users')

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/', userRouter)

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
