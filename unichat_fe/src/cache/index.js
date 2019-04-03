/**
 * 缓存系统
 * 聊天用户缓存： LFU(最近最久未使用)
 * 聊天记录缓存： FIFO(先进先出)
 */

import Vue from 'vue'
import LFUCache from './LFUCache'

Object.defineProperties(Vue.prototype, {
    $msgCache: {
        get () {
            return new LFUCache('MESSAGE', 1024)
        }
    },
    $userCache: {
        get () {
            return new LFUCache('ACTIVE_USER', 100)
        }
    }
})