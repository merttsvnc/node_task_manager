const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

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

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((key) => allowedUpdates.includes(key))

  if (!isValidOperation)
    return res.status(400).send({ error: 'Invalid updates!' })
  const { user } = req
  try {
    updates.forEach((key) => (user[key] = req.body[key]))
    await user.save()
    res.send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.deleteOne()
    res.send(req.user)
  } catch (err) {
    res.status(500).send(err)
  }
})

const upload = multer({
  limits: {
    fileSize: 1000000, // 1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new Error('Please upload an image'))
    cb(undefined, true)
  },
})

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    // req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message })
  }
)

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar)
      throw new Error('Unable to find user or user avatar')
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (err) {
    res.status(404).send()
  }
})

module.exports = router
