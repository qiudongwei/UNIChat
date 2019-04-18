/**
 * LFU(最近最久未使用)缓存系统
 */

import { sizeof, clone, arr2Obj, warn } from './utils'
import Pubsub from './pubsub'

class LFUCache {
    constructor (nameSpace) {
        this.$nameSpace = nameSpace
        this.pubsub = new Pubsub()
        this._initCache()
        this._calculateRemainSize()
    }

    get SIZE () {
        return 4 * 1024 *1024 // 4MB
    }

    get MAX () {
        return 50
    }

    get _EVENT () {
        return new Set(['expire', 'set', 'remove', 'clear'])
    }

    nameSpace (nameSpace) {
        if(!nameSpace) {
            warn('LFUCache: namespace should not empty.')
            return
        }
        this.$nameSpace = nameSpace
        this._initCache()
        return this
    }

    max (num) {
        this.$max = num || this.MAX
        return this
    }

    size (size) {
        this.$size = size || this.SIZE
        return this
    }

    expire (secs) {
        if(this.$nameSpace){
            warn('LFUCache: Please set namespace first.')
            return
        }
        this.$expire = secs || 7 * 24 * 60 * 60
        const lfuExpire = JSON.parse(window.localStorage.getItem('LFUCACHE_EXPIRE') || '{}')
        lfuExpire[this.$nameSpace] = Date.now()
        window.localStorage.setItem('LFUCACHE_EXPIRE', JSON.stringify(lfuExpire))
    }

    getSize () {
        return this.$size
    }

    getMax () {
        return this.$max
    }

    getNameSpace () {
        return this.$nameSpace
    }

    getRemainSize () {
        return this.$remainSize
    }

    getExpire () {
        return this.$expire
    }

    set (key, data) {
        data = clone(data)
        let weight = 1
        if(this.has(key)) { // 先更新
            weight = this._find(key)._weight + 1
        }
        const { max, size } = this._isOverflow(key, data)
        if(size === -1) {
            warn(`LFUCache: exceed maxsize, store ${key} failed.`)
            return this
        } else if(!max || size) {
            const del = this._delete(max, size, key)
            if(!del) {
                warn(`LFUCache: exceed maxsize, store ${key} failed.`)
                return this
            }
        }
        const val = Object.assign({
            _id: key,
            _weight: weight,
            _lastmodify: new Date().getTime()
        }, data)
        this.$cache[key] = val
        this._update()
        console.log(this.$nameSpace, this.$remainSize)
        return this
    }

    get (key) {
        const exclude = new Set(['_id', '_weight', '_lastmodify'])
        const val = Reflect.get(this.$cache, key)
        return val ? Object.keys(val)
              .filter(each => !exclude.has(each))
              .reduce((acc, curr) => {
                  acc[curr] = val[curr]
                  return acc
              }, {})
            : null
    }

    remove (key) {
        const ret = Reflect.deleteProperty(this.$cache, key)
        if(ret) {
            this._update()
        }
        return ret
    }

    keys () {
        return Object.keys(this.$cache)
    }

    values () {
        const exclude = new Set(['_id', '_weight', '_lastmodify'])
        return Object.values(this.$cache)
                     .sort((a, b) => b._weight - a._weight)
                     .map(each => Object.keys(each)
                        .filter(key => !exclude.has(key))
                        .reduce((acc, curr) => {
                            acc[curr] = each[curr]
                            return acc
                        }, {})
                     )
    }

    entries () {
        const exclude = new Set(['_id', '_weight', '_lastmodify'])
        return Object.entries(
                    Object.values(this.$cache)
                    .sort((a, b) => b._weight - a._weight)
                    .reduce((acc, curr) => {
                        acc[curr._id] = Object.keys(curr)
                            .filter(key => !exclude.has(key))
                            .reduce((accer, key) => {
                                accer[key] = curr[key]
                                return accer
                            }, {})
                        return acc
                    }, {})
                )
    }

    on (evt, cb) {
        if(!this._EVENT.has(evt) || typeof cd !== 'function') return
        this.pubsub.subscribe(evt, cb)
    }

    off (token) {
        this.pubsub.unsubscribe(token)
    }

    has (key) {
        return Reflect.has(this.$cache, key)
    }

    clear () {
        window.localStorage.removeItem(this.$nameSpace)
        return this
    }

    _initCache () {
        this.$max = this.MAX
        this.$size = this.SIZE
        if(this._isExpire()) {
            this.clear()
        }
        this.$cache = JSON.parse(window.localStorage.getItem(this.$nameSpace)) || {}
        this._amount = this.keys().length
    }

    _find (key) {
        return Reflect.get(this.$cache, key)
    }

    _delete(max, size, id) {
        let delArr = null
        let delSize = 0
        const delKeys = []
        const emptyObjSize = sizeof(JSON.stringify({}))
        const cacheArr = Object.values(this.$cache)
                               .sort((a, b) => a._weight - b._weight)
                               .filter(each => each._id !== id)
        const len = cacheArr.length
        let i = !max ? 1 : 0 // 超过数量限制，将第一个剔除
        let position = i
        for(; i < len; i++) {
            delKeys.push(cacheArr[i]._id)
            delArr = cacheArr.slice(0, i + 1)
            delSize = sizeof(JSON.stringify(arr2Obj(delArr))) - emptyObjSize
            position = i
            if(delSize >= size) {
                size = 0
                break
            }
        }
        if(size) return false

        const remainArr = cacheArr.slice(position + 1, len)
        const cache = remainArr.reduce((acc, curr) => {
            acc[curr._id] = curr
            return acc
        }, {})
        this.$cache = cache
        return delKeys
    }

    _update () {
        window.localStorage.setItem(this.$nameSpace, JSON.stringify(this.$cache))
        this._amount = this.keys().length
        this._calculateRemainSize()
    }

    _isOverflow (key, data) {
        let valSize = 0
        let max = this._amount - (this.$max || -1)
        let size = 0
        
        const val = this._find(key)
        const lfuData = Object.assign({
            _id: key,
            _weight: val ? val._weight + 1 : 1,
            _lastmodify: new Date().getTime()
        }, data)
        if(!val) { // 新数据
            const temp = {}
            temp[key] = lfuData
            valSize = sizeof(JSON.stringify(temp))
        } else {
            const diff = sizeof(JSON.stringify(val)) - sizeof(JSON.stringify(lfuData))
            valSize = diff > 0 ? 0 : Math.abs(diff)
        }
        if(valSize > this.$size) {
            size = -1
        } else if(valSize > this.$remainSize) {
            size = valSize - this.$remainSize
        }
        return { max, size }
    }

    _isExpire () {
        const _expire = JSON.parse(window.localStorage.getItem('LFUCACHE_EXPIRE'))
        _expire = _expire ? _expire[this.$nameSpace] : null
        if(!_expire) return false
        const now = Date.now()
        return  now > (_expire + this.$expire * 1000)
    }

    _calculateRemainSize () {
        this.$remainSize = this.$size - sizeof(window.localStorage.getItem(this.$nameSpace || ''))
    }
}

export default LFUCache