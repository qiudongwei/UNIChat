/**
 * LFU(最近最久未使用)缓存系统
 */

import { arrayKeys, sizeof } from './utils'

class LFUCache {
    constructor (nameSpace, maxSize) {
        this.$nameSpace = nameSpace
        this.$maxSize = maxSize || 3 * 1024 * 1024 // 3MB
        this._initCache()
        this._calculateRemainSize()
    }

    nameSpace (nameSpace) {
        this.$nameSpace = nameSpace
        this._initCache()
        return this
    }

    size (maxSize) {
        this.$maxSize = maxSize
        return this
    }

    set (key, data) {
        const lack = this._willOverflow(key, data)
        if(lack) { // 溢出，先删除
            this._delete(lack)
        }
        let weight = 1
        if(this._isExit(key)) {
            weight = this._find(key)._weight + 1
        }
        const val = Object.assign({
            _id: key,
            _weight: weight,
            _lastmodify: new Date().getTime()
        }, data)
        this.$cache[key] = val
        console.log(this.$nameSpace, this.$cache)
        this._update()
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

    all () {
        const exclude = new Set(['_id', '_weight', '_lastmodify'])
        return Object.values(this.$cache).sort((a, b) => b._weight - a._weight)
                     .map(each => Object.keys(each)
                        .filter(key => !exclude.has(key))
                        .reduce((acc, curr) => {
                            acc[curr] = each[curr]
                            return acc
                        }, {})
                     )
    }

    clear () {
        window.localStorage.removeItem(this.$nameSpace)
    }

    getSize () {
        return this.$maxSize
    }

    getNameSpace () {
        return this.$nameSpace
    }

    getRemainSize () {
        return this.$remainSize
    }

    _initCache () {
        this.$cache = JSON.parse(window.localStorage.getItem(this.$nameSpace)) || {}
    }

    _find (key) {
        return Reflect.get(this.$cache, key)
    }

    _isExit (key) {
        return Reflect.has(this.$cache, key)
    }

    _delete(size) {
        let position = 0
        let lack = 0
        let delArr = null
        let delSize = 0
        const cacheArr = Object.values(this.$cache).sort((a, b) => a._weight - b._weight)
        console.log(cacheArr)
        const len = cacheArr.length
        for(let i = 0; i < len; i++) {
            delArr = cacheArr.slice(0, i + 1)
            delSize = sizeof(JSON.stringify(delArr))
            position = i
            if(delSize === size) {
                lack = 0
                break
            } else if(delSize > size) {
                delArr.pop()
                lack = size - sizeof(JSON.stringify(delArr))
                break
            }
        }

        let remainArr = cacheArr.slice(position + 1, len)
        let isEnough = false

        if(lack) {
            const data = cacheArr[position]
            const keys = arrayKeys(data)
            if(keys.length > 0) {
                for(let j = 0; j < keys.length; j++) {
                    const key = keys[j]
                    let cursor = 0
                    const arr = Reflect.get(cacheArr[position], key)
                    arr.some((each, index, arr) => {
                        cursor = index + 1
                        delArr = arr.slice(0, cursor)
                        if(sizeof(JSON.stringify(delArr)) >= lack) {
                            isEnough = true
                            return true
                        }
                        return false
                    })
                    if(isEnough) {
                        Reflect.set(cacheArr[position], key, arr.splice(cursor))
                        break
                    } else {
                        Reflect.set(cacheArr[position], key, [])
                    }
                }
            }
        }

        if(isEnough) {
            remainArr = cacheArr.slice(position, len)
        }
        this.$cache = remainArr.reduce((acc, curr) => {
            acc[curr._id] = curr
            return acc
        }, {})
        this._update()
    }

    _update () {
        window.localStorage.setItem(this.$nameSpace, JSON.stringify(this.$cache))
        this._calculateRemainSize()
    }

    _willOverflow (key, data) {
        let val = this._find(key)
        let valSize = 0
        if(!val) { // 新数据
            val = Object.assign({
                _id: key,
                _weight: 1,
                _lastmodify: new Date().getTime()
            }, data)
            valSize = sizeof(JSON.stringify(data || ''))
        } else {
            const diff = sizeof(JSON.stringify(val)) - sizeof(JSON.stringify(data))
            valSize = diff > 0 ? 0 : Math.abs(diff)
        }
        console.log(this.$remainSize, valSize)
        return this.$remainSize < valSize && (valSize - this.$remainSize)
    }

    _calculateRemainSize () {
        this.$remainSize = this.$maxSize - sizeof(window.localStorage.getItem(this.$nameSpace || ''))
    }
}

export default LFUCache