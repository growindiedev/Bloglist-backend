const bcrypt = require('bcrypt')
const { response } = require('express')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs')
    res.json(users)
})

usersRouter.post('/', async(req, res) => {
    const {username, password, name} = req.body

    const passwordHash = await bcrypt.hash(password, 10)

    if(password.length < 3){
        return response.status(400).json({error: 'password must be least 3 char long'})
    }

    const user = new User({
        username, name, passwordHash
    })

    const savedUser = await user.save()
    res.json(savedUser)
})

module.exports = usersRouter