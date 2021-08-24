import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is reuired',
  },

  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@..+/, 'Please fill a valied amail adress'],
    required: 'Email is required',
  },
  cerated: {
    type: Date,
    default: Date.now,
  },
  updated: Date,

  //hashed password and salt

  hashed_password: {
    type: String,
    reuired: 'Password is required',
  },
  salt: String,
})

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

UserSchema.method = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + ''
  },
}
UserSchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password muse be at least 6 charachters')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

export default mongoose.model('User', UserSchema)
