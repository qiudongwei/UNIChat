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
        code: 100,
        data: data
    })
})

router.post('/get_info', (req, res) => {
    const postData = Object.assign({}, req.body)
    // const info = fs.readFileSync(USER_FILE, {encoding: 'utf-8'})
    // const data = JSON.parse(info)
    // const users = Object.keys(data)
    // const ids = users.map(each => data[each])
    // const index = ids.findIndex(each => each === postData.uid)
    let rst = null
    const data = Utils.getUserInfo(postData.uid)
    if(data === -1) {
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

doLogin({wilton:'dhjka789dshjkh'})

module.exports = router