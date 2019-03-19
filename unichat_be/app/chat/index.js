/**
 * Chat WebSocket
 */

const WebSocket = require('ws')
const Utils = require('../../utils')

const createChatSocket = function (conf) {
    const { path, server} = conf
    const singleWss = new WebSocket.Server({
        path: path + '/single_chat',
        server
    })

    const sockets = {}

    singleWss.on('connection', (socket, req) => {
        const uid = parseUrlParams(req.url, 'uid')
        sockets[uid] = socket
        if(!/chat\S+$/.test(req.url)) { // 非法连接
            socket.close(4000, 'Invalid URL')
        }
        socket.on('message', (data) => {
            data = JSON.parse(data)
            userInfo = Utils.getUserInfo(data.from)
            Object.assign(data, {
                name: userInfo.username
            })
            sockets[data.to] && sockets[data.to].send(JSON.stringify(data))
        })
    })

    // const multiWss = new WebSocket.Server({
    //     path: path + '/multi_chat',
    //     server
    // })

    // multiWss.on('connection', (socket, req) => {
    //     if(!/chat\S+$/.test(req.url)) { // 非法连接
    //         socket.close(4000, 'Invalid URL')
    //     }
    //     console.log(req.url)
    //     socket.on('message', (msg) => {
    //         console.log(msg)
    //         socket.send('收到群消息...')
    //     })
    // })
}

const parseUrlParams = function (url, name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    const params = url.split('?').reverse()[0]
    const r = params.match(reg)
    return r ? r[2] : null
}

module.exports = createChatSocket