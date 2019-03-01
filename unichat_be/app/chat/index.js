/**
 * Chat WebSocket
 */

const WebSocket = require('ws')

const createChatSocket = function (conf) {
    const { path, server} = conf
    const singleWss = new WebSocket.Server({
        path: path + '/single_chat',
        server
    })

    singleWss.on('connection', (socket, req) => {
        if(!/chat\S+$/.test(req.url)) { // 非法连接
            socket.close(4000, 'Invalid URL')
        }
        console.log(req.url)
        socket.on('message', (msg) => {
            console.log(msg)
            socket.send('收到一对一消息...')
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

module.exports = createChatSocket