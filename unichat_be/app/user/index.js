const express = require('express')
const router = express.Router()
const MD5 = require('crypto-js/md5')
const fs = require('fs')
const Utils = require('../../utils')

const USER_FILE = `${process.cwd()}/data/user.json`

router.post('/login', (req, res) => {
    const postData = Object.assign({}, req.body)
    const tmp = {}
    tmp[postData.username] = MD5(postData.username).toString()
    const data = doLogin(tmp)
    res.json({
        result: 1,
        code: 101,
        data: data
    })
})

router.post('/get_info', (req, res) => {
    const postData = Object.assign({}, req.body)
    let rst = null
    const data = Utils.getUserInfo(postData.uid)
    if(!data) {
        rst = {
            result: 0,
            code: 101,
            msg: '用户不存在'
        }
    } else {
        rst = {
            result: 1,
            code: 100,
            data: data
        }
    }
    res.json(rst)
})

router.post('/get_friends', (req, res) => {
    const friends = Utils.getFriendList()
    res.json({
        result: 1,
        code: 100,
        data: friends
    })
})

const doLogin  = function (value) {
    const name = Object.keys(value)[0]
    const id = value[name]
    let data = null
    try {
        const info = fs.readFileSync(USER_FILE, {encoding: 'utf-8'})
        data = JSON.parse(info)
        const users = Object.keys(data)
        if(!users.includes(name)) {
            data[name] = id
        }
    } catch (e) {
        data = value
    }
    const writeStream = fs.createWriteStream(USER_FILE, {encoding: 'utf-8'})
    writeStream.write(JSON.stringify(data))
    writeStream.end()
    return { name, id }
}

module.exports = router