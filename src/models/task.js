const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: String,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // This is the reference to the User model
    ref: 'User',
  },
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
