const express = require('express')
const router = new express.Router()
const User = require('../models/user')

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/users/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)
    if (!user) return res.status(404).send()
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.patch('/users/:id', async (req, res) => {
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

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findByIdAndDelete(id)
    if (!user) return res.status(404).send()
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
