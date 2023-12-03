const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (err) {
    res.status(400).send()
  }
})

router.post('/users/logout', auth, async (req, res) => {
  const { user, token } = req
  try {
    user.tokens = user.tokens.filter((t) => t.token !== token)
    await user.save()
    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

// Logout from all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
  const { user } = req
  try {
    user.tokens = []
    await user.save()
    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
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
    const user = await User.findById(id)
    updates.forEach((key) => (user[key] = req.body[key]))
    await user.save()

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
