const blogsRouter = require('express').Router()
const { response } = require('express')
const { request } = require('../app')
const Blog = require('../models/Blog')

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
    const blog = new Blog(request.body)
  
      const result = await blog.save()
      return response.status(201).json(result)
      
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
