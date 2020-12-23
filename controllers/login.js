const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')
require('dotenv').config()

loginRouter.post('/', async(req, res) => {

    // Authentication
    const {username, password} = req.body
    const user = await User.findOne({username})
    const passwordCorrect = (user === null) ? false : await bcrypt.compare(password, user.passwordHash)

    if(!(user && passwordCorrect)) {
        return response.status(404).json({ error: 'invalid username or password'})
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)
    res.status(200).send({token, username: user.username, name: user.name})
})

module.exports = loginRouter