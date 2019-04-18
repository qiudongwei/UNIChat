/**
 * 缓存系统
 * 聊天用户缓存： LFU(最近最久未使用)
 * 聊天记录缓存： FIFO(先进先出)
 */

import Vue from 'vue'
import LFUCache from './LFUCache'

const msgCache = new LFUCache('MESSAGE', 600)
const userCache = new LFUCache('ACTIVE_USER', 200)
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