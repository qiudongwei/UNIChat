/**
 * 缓存系统
 * 聊天用户缓存： LFU(最近最久未使用)
 * 聊天记录缓存： FIFO(先进先出)
 */

import Vue from 'vue'
import LFUCache from './LFUCache'

const msgCache = new LFUCache('MESSAGE').size(700).expire(2*60)
msgCache.on('set', (key) => {
    console.log(`set ${key} in ${msgCache.$nameSpace}`)
})
msgCache.on('remove', (key) => {
    console.log(`remove ${key} in ${msgCache.$nameSpace}`)
})
msgCache.on('expire', (namespace) => {
    console.log(`${namespace} is expired.`)
})
msgCache.on('clear', (namespace) => {
    console.log(`${namespace} is clear.`)
})
console.log(msgCache.get('d0177d5f5d938bbbb5c6dcd9917bc565'))
const userCache = new LFUCache('ACTIVE_USER').size(200)
Object.defineProperties(Vue.prototype, {
    $msgCache: {
        get () {
            return msgCache
        }
    },
    $userCache: {
        get () {
            return userCache
        }
    }
})