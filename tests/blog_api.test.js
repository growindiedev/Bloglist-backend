const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/Blog')

const blogs = [ 
    {title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7}, 
    {title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5}, 
    {title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12}, 
    {title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10}, {title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0}, 
    {title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2}
]



beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(blogs)
})

const blogsInDB = async () => {
    const blogsDB = await Blog.find({})
    return blogsDB.map(blog => blog.toJSON())
}

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogs.length)
})

test('blog is created in the database', async () => {
    const newBlog = {
        title: "Thinking Fast And Slow",
        author: "Daniel Kahneman",
        url: "goodreads.com",
        likes: "3638"
    }

     await api
     .post('/api/blogs')
     .send(newBlog)
     .expect(201)
     .expect('Content-Type', /application\/json/)

     const blogsAtEnd = await blogsInDB()
     expect(blogsAtEnd).toHaveLength(blogs.length + 1)
})

test('id property is defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('default likes are 0', async () => {
    const newBlog = {
        title: "Thinking Fast And Slow",
        author: "Daniel Kahneman",
        url: "goodreads.com",
    }

    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.body.likes).toBe(0)

})

test('title and url missing', async () => {
    const newBlog = {
        author: "Daniel Kahneman",
    } 

    await api
     .post('/api/blogs')
     .send(newBlog)
     .expect(400)

})

test('blog can be deleted', async () => {
    //const blogsDB = await Blog.find({})
    const blogsDB = await blogsInDB()
    const blogToDelete = JSON.parse(JSON.stringify(blogsDB[0]))

    await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(404)

    const blogsAtEnd = await blogsInDB()
     expect(blogsAtEnd).toHaveLength(blogs.length - 1)
    
})

test('blog can be updated', async() => {
    const blogsDB = await blogsInDB()
    const blogToUpdate = JSON.parse(JSON.stringify(blogsDB[0]))
    const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send({likes: 45})
    
    expect(response.body.likes).toBe(45)
    const blogsAtEnd = await blogsInDB()
    expect(blogsAtEnd).toHaveLength(blogs.length)


})




afterAll(() => {
    mongoose.connection.close()
})
