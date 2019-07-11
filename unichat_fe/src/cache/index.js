/**
 * 缓存系统
 * 聊天用户缓存： LFU(最近最久未使用)
 * 聊天记录缓存： FIFO(先进先出)
 */

import Vue from 'vue'
import LFUStorage from 'lfustorage'

const msgCache = new LFUStorage('MESSAGE').max(1).expire(7* 24 * 60 * 60)
msgCache.on('set', (key) => {
    console.log(`set ${key} in ${msgCache.$nameSpace}`)
})
msgCache.on('remove', (key) => {
    console.log(`remove ${key} in ${msgCache.$nameSpace}`)
})
msgCache.on('overflow', (res) => {
    console.log('overflow: ', res)
})
msgCache.on('clear', (namespace) => {
    console.log(`${namespace} is clear.`)
})

const userCache = new LFUStorage('ACTIVE_USER').size(200)
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