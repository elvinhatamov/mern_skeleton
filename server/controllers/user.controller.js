import User from '../models/user.model.js'
import extend from 'lodash/extend.js'
import errorHandler from '../helpers/dbErrorHandler.js'

const create = async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: ' Successfully signed up!',
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created') //find ALL TRHE USER FROM DATABASE AND POPULATE ONLY NAME UPDATED EMAIL CREATED FIELDS
    res.json(users) //RETURNS THE LIST OF USER AS A JSON OBJECT IN ARRAY TO THE REQUESTING CLIENT
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
    if (!user)
      return res.status(400).json({
        error: 'user not found',
      })
    req.profile = user //  If a matching use ris fouind in the database , the user object is appended to the request object in the pprofile key
    next() // next() middleweare is used to propagate control to the ebnxt relevant controller  fucntion
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve user',
    })
  }
}

// the read function retrieves the user details from req.profile and removes sensitives information , such as hashed-password and slat values , before sending the user object in the response to the requesting client.
const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

// update funntion retireves the user detail from req.profile and yuse lodash module to extend and merge the changes that came in the request body to update user data.
const update = async (req, res) => {
  try {
    let user = req.prtofile
    user = extend(user, req.body)
    user.update = Date.now() //Before saving this updated user to the database , the updared field is populated with the current date to reflect the last uptaded timestamp
    await user.save() //save the user to database
    user.hashed_password = undefined //remove sensitive datas before sending the user object in the respond to the request
    user.salt = undefined
    res.json(user) //respond the request
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

export default (create, list, userByID, read, update, remove)
