require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//   // const task = await Task.findById('656c5a4a8d3c1885ce7d008a')
//   // await task.populate('owner')
//   // console.log(task.owner)

//   const user = await User.findById('656c5937d814dc524acd1d7a')
//   await user.populate('tasks')
//   console.log(user.tasks)
// }
// main()
