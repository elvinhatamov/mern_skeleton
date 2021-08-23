import config from '../config/config.js'
import app from './express.js'
import mongoose from 'mongoose'

mongoose.Promise = global.Promise
// mongoose.connection(config.mongoUri, {
//   usenewUrlParser: true,
//   useCreateindex: true,
//   useUnifiedtopology: true,
// })

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database : ${mongoUri}`)
})

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info(`server is running on the port %s`, config.port)
})
