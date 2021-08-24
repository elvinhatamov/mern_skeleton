import express from 'express'
import authCtrl from '../controllers/auth.controller.js'

const authRouters = express.Router()

router.authRouters('/auth/signin').post(authCtrl.signin)
router.authRouters('/auth/signout').get(authCtrl.signout)

export default authRouters
