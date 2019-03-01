const express = require('express')
const app = express()
const server = require('http').Server(app)

// 聊天socket
const createChatSocket = require('./app/chat')
createChatSocket({
    path: '/chat',
    server
})

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// log
app.use(async (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Process ${req.method} ${req.url}`)
    await next()
})

const User = require('./app/user')
app.use('/user', User)

server.listen(8081, () => {
    console.log('UNIChat runing on port 8081...')
})