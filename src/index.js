const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.get('/users/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)
    if (!user) return res.status(404).send()
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.patch('/users/:id', async (req, res) => {
  const { id } = req.params
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((key) => allowedUpdates.includes(key))

  if (!isValidOperation)
    return res.status(400).send({ error: 'Invalid updates!' })

  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!user) return res.status(404).send()
    res.send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findByIdAndDelete(id)
    if (!user) return res.status(404).send()
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)

  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params

  try {
    const task = await Task.findById(id)
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((key) => allowedUpdates.includes(key))

  if (!isValidOperation)
    return res.status(400).send({ error: 'Invalid updates!' })

  try {
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params

  try {
    const task = await Task.findByIdAndDelete(id)
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
