import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compress from 'compression'
import cors from 'cors'
import Template from './../template.js'
import userRouters from './routers/user.routes.js'
import authRouters from './routers/auth.routes.js'
const app = express()

app.get('/', (req, res) => {
  res.status(200).send(Template())
})

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: err.name + ': ' + err.message,
    })
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message })
    console.log(err)
  }
})

app.use('/', userRouters)
app.use('/', authRouters)
app.use(bodyParser.json)
app.use(bodyParser.urlencoded)
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

export default app
