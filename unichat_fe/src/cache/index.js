/**
 * 缓存系统
 * 聊天用户缓存： LFU(最近最久未使用)
 * 聊天记录缓存： FIFO(先进先出)
 */

import Vue from 'vue'
import { isObject, Obj2Node, clone, array2link, link2array } from './utils'

class Node {
    constructor (uid, uname, updatetime, records) {
        this.uid = uid
        this.uname = uname
        this.updatetime = updatetime
        this.frequency = 1
        this.records = records
        this.prev = null
        this.next = null
    }

}

class Cache {
    constructor () {
        this.messages = JSON.parse(window.localStorage.getItem('MESSAGE')) || []
    }

    setActiveUser (val) {
        let data = val || null
        if(isObject(val)) {
            data = JSON.stringify(val)
        }
        window.localStorage.setItem('ACTIVE_USER', data)
    }

    getActiveUser () {
        const data = window.localStorage.getItem('ACTIVE_USER')
        return JSON.parse(data)
    }

    clearActiveUser () {
        window.localStorage.removeItem('ACTIVE_USER')
    }

    set (uid, data) {
        const keys = ['uid', 'uname', 'updatetime', 'records']
        console.log('is?',this.isExit(uid))
        if(this.isExit(uid)) {
            const index = this.findIndex(uid)
            const message = this.messages[index]
            message.records = message.records.concat(data.records)
            message.frequency ++
        } else {
            let linkList = array2link(this.messages, Node, keys)
            const val = Object.assign({
                uid: uid,
                uname: data.name,
                updatetime: new Date().getTime(),
                records: data.records
            })
            const node = Obj2Node(val, Node, keys)
            linkList = linkList || node
            let head = linkList
            while (head) {
                if(head.frequency <= node.frequency) {
                    const prev = head.prev
                    if(!prev) {
                        node.next = head
                        head.prev = node
                    } else {
                        prev.next = node
                        node.prev = prev
                        node.next = head
                    }
                    break
                }
                head = head.next
            }
            console.log(linkList)
            this.messages = link2array(linkList, keys)
        }

        this._uodateMessageCache(this.messages)
    }

    _uodateMessageCache (messages) {
        window.localStorage.setItem('MESSAGE', JSON.stringify(messages))
    }

    getChatList () {
        return this.messages.map(each => {
            return {
                uid: each.uid,
                uname: each.uname,
                data: clone(each.records.reverse()[0])
            }
        })
    }

    get (uid) {
        const message = this.messages.filter(each => each.uid === uid)
        .map(each => each.records)
        // 克隆一个新对象，避免被外部修改导致数据污染
        return message.length ? clone(message[0]) : null
    }

    clear () {
        window.localStorage.removeItem('MESSAGE')
    }

    findIndex (uid) {
        return this.messages.findIndex(each => each.uid === uid)
    }

    isExit (uid) {
        return this.messages.filter(each => each.uid === uid).length ? true : false
    }
}

Object.defineProperties(Vue.prototype, {
    $cache: {
        get () {
            return new Cache()
        }
    }
})