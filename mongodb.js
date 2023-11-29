// CRUD create read update delete
const monggodb = require('mongodb')
const MongoClient = monggodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017' // 127.0.0.1:27017
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database!')
  }

  const db = client.db(databaseName)

  db.collection('users').insertOne(
    {
      name: 'Andrew',
      age: 27,
    },
    (error, result) => {
      if (error) {
        return console.log('Unable to insert user', error)
      }
      console.log(result.ops)
    }
  )
})
