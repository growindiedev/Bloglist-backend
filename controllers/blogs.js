const blogsRouter = require('express').Router()
const { response } = require('express')
const { request } = require('../app')
const Blog = require('../models/Blog')
const User = require('../models/User')

// const blogss = [ 
//   {title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, userId: "5fe1ff9b3bee3914e811c5aa"}, 
//   {title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, userId: "5fe1ff9b3bee3914e811c5aa"}, 
//   {title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, userId: "5fe1ff9b3bee3914e811c5aa"}, 
//   {title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10}, {title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, userId: "5fe1ff9b3bee3914e811c5aa"}, 
//   {title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, userId: "5fe1ff9b3bee3914e811c5aa"}
// ]

  blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    return response.json(blogs)
    
  })

  blogsRouter.get('/:id', async (request, response) => {
    const { id } = request.params
    const result = await Blog.findById(id)
    return response.json(result)
  })

  
  blogsRouter.post('/', async (request, response) => {
      const {title, author, url, likes, userId} = request.body
      const theUser = await User.findById(userId)
      const blog = new Blog({title, author, url, likes, user: theUser.id})
  
      const savedBlog = await blog.save()
      theUser.blogs = theUser.blogs.concat(savedBlog.id)
      await theUser.save()

      return response.status(201).json(savedBlog)
      
  })

  blogsRouter.put('/:id', async (request, response) => {
    const { id } = request.params
    const result = await Blog.findByIdAndUpdate(id, request.body, {new: true})
    return response.json(result)
  })


  blogsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params
    const result = await Blog.findByIdAndDelete(id)
    return response.status(404).end()
  })



  module.exports = blogsRouter
