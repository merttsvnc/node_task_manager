const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body)

  const task = new Task({
    ...req.body,
    owner: req.user._id,
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/tasks', auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id })
    await req.user.populate('tasks')
    res.send(req.user.tasks)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const { id } = req.params

  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id })
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((key) => allowedUpdates.includes(key))

  if (!isValidOperation)
    return res.status(400).send({ error: 'Invalid updates!' })

  const { id: taskID } = req.params
  const { _id: userID } = req.user
  try {
    const task = await Task.findOne({
      _id: taskID,
      owner: userID,
    })
    if (!task) return res.status(404).send()

    updates.forEach((key) => (task[key] = req.body[key]))
    await task.save()
    res.send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  const { id: taskID } = req.params
  const { _id: userID } = req.user

  try {
    // const task = await Task.findByIdAndDelete(id)
    const task = await Task.findOneAndDelete({
      _id: taskID,
      owner: userID,
    })
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
