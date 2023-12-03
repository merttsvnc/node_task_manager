const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) throw new Error('Email is invalid')
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
      validate: (value) => {
        if (value.toLowerCase().includes('password'))
          throw new Error('Password cannot contain "password"')
      },
    },
    age: {
      type: Number,
      default: 0,
      validate: (value) => {
        if (value < 0) throw new Error('Age must be a positive number')
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: { type: Buffer },
  },
  {
    timestamps: true,
  }
)

// virtual property
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
})

/**
 * Converts a user object to a plain JavaScript object.
 *
 * @param {Object} user - The user object to convert.
 * @returns {Object} - The plain JavaScript object representation of the user.
 */
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  return userObject
}

// custom method to generate authToken
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

// custom method to find user by email and password
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) throw new Error('Unable to login')

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) throw new Error('Unable to login')

  return user
}

// hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password'))
    user.password = await bcrypt.hash(user.password, 8)

  next()
})

// delete user tasks when user is removed
userSchema.pre('deleteOne', { document: true }, async function (next) {
  const user = this
  try {
    await Task.deleteMany({ owner: user._id })
    next()
  } catch (error) {
    next(error)
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
