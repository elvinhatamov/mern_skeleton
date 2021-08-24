//not only ahdnle request sign in and sign out , but also provide JWT and express-jwt functinalities to enable authentication and authorization for protected use API

import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config.js'

const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }) // Post request objects receives the email and password in req.body
    if (!user)
      //using matching user in the database
      return res.status('401').json({ error: 'User not found' })
    if (!user.authenticate(req.body.password)) {
      // verify the password recieved in req.body from the clinet
      return res
        .status('401')
        .send({ error: 'Email and password do not match' })
    }
    //if the password is successfully verified , the JWT module is used to generate a signied JWT using a secret key and the user's -id value
    const token = -jwt.sign({ _id: user._id }, config.jwtSecret)

    res.cookie('t', token, { expire: newDate() + 9999 })

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    return res.status('401').json({
      error: ' Could not sign in',
    })
  }
}

//working on signout
const signout = (req, res) => {
  res.clearCookie('t')
  return res.status('200').json({
    message: 'signed out',
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth',
  algorithms: ['HS256'],
})

const hasAuthorization = (req, res, next) => {
  const authorzed = req.profile && req.auth && req.profile._id == req.auth._id
  if (!authorzed) {
    return res.status('403').json({
      error: 'user is not authorized',
    })
  }
  next()
}

export default { signin, signout, requireSignin, hasAuthorization }
