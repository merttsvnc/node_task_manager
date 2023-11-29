const mongoose = require('mongoose')
const validator = require('validator')

mongoose
  .connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err))

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Email is invalid')
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password'))
        throw new Error('Password cannot contain "password"')
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) throw new Error('Age must be a positive number')
    },
  },
})

const me = new User({
  name: '   Serhat mertt',
  email: 'mert@mert.com       ',
  password: 'phone098!',
})

me.save()
  .then(() => console.log(me))
  .catch((err) => console.error('Error:', err))

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
})

// const task = new Task({
//   description: 'Learn the Mongoose library',
//   completed: false,
// })

// task
//   .save()
//   .then(() => console.log(task))
//   .catch((err) => console.error('Error:', err))
