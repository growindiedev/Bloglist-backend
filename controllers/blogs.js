const blogsRouter = require('express').Router()
const { response } = require('express')
const { request } = require('../app')
const Blog = require('../models/Blog')
const User = require('../models/User')
const {authenticateToken} = require('../utils/middleware')


  blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    return response.json(blogs)
    
  })

  blogsRouter.get('/:id', async (request, response) => {
    const { id } = request.params
    const result = await Blog.findById(id).populate('user' )
    return response.json(result)
  })

  
  blogsRouter.post('/', authenticateToken , async (request, response) => {


      const {title, author, url, likes} = request.body

      const decodedToken = request.decodedToken
      const user = await User.findById(decodedToken.id)
      const blog = new Blog({title, author, url, likes, user: user.id})

      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog.id)
      await user.save()
      return response.status(201).json(savedBlog)
      
  })


  blogsRouter.put('/:id', async (request, response) => {
    const { id } = request.params
    const result = await Blog.findByIdAndUpdate(id, request.body, {new: true})
    return response.json(result)
  })


  blogsRouter.delete('/:id', authenticateToken, async (request, response) => {
    const { id } = request.params

    const blog = await Blog.findById(id)
    const user = await User.findById(request.decodedToken.id)
    //check if creater of blog is trying to delete it 
    if(blog.user.toString() === user.id.toString()){
      await Blog.findByIdAndDelete(id)
    
    // remove the blog from user object blogs array
      user.blogs.splice(user.blogs.indexOf(blog.id), 1)
      await user.save()
      response.status(204).end()
      
    } else {
      response.status.status(404).json({ error: 'You are not authorized to delete this blog' })
    }
    
    
  })



  module.exports = blogsRouter
