const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const {MONGODB_URI} = require('./utils/config')
const {requestLogger, unknownEndpoint, errorHandler} = require('./utils/middleware')

  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  
  app.use(cors())
  app.use(express.static('build'))
  app.use(express.json())
  app.use(requestLogger)
  app.use('/api/blogs', blogsRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/login', loginRouter)


  app.use(errorHandler)
  app.use(unknownEndpoint)


  module.exports = app