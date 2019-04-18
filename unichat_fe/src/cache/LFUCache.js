/**
 * LFU(最近最久未使用)缓存系统
 */

import { arrayKeys, sizeof, clone, arr2Obj } from './utils'

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
        data = clone(data)
        let weight = 1
        const lack = this._willOverflow(key, data)
        if(lack) { // 判断溢出，执行删除
            const { id } = this._delete(lack)
            if(id === key) {
                data = this._clearArrData(data)
            }
        }
        if(this._isExit(key)) { // 先更新
            weight = this._find(key)._weight + 1
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

    all () {
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
        let delArr = null
        let delSize = 0
        const emptyObjSize = sizeof(JSON.stringify({}))
        const cacheArr = Object.values(this.$cache).sort((a, b) => a._weight - b._weight)
        const len = cacheArr.length
        for(let i = 0; i < len; i++) {
            delArr = cacheArr.slice(0, i + 1)
            delSize = sizeof(JSON.stringify(arr2Obj(delArr))) - emptyObjSize
            position = i
            if(delSize === size) {
                deltotal += delSize
                size = 0
                break
            } else if(delSize > size) {
                delArr.pop()
                if(delArr.length) {
                    size = size - sizeof(JSON.stringify(arr2Obj(delArr))) + emptyObjSize
                }
                break
            }
        }

        let remainArr = cacheArr.slice(position + 1, len)
        let isEnough = false
        if(size) {
            const { data, lack } = this._delArrData(cacheArr[position], size)
            if(lack === 0) {
                cacheArr[position] = data
                isEnough = true
            }
            size = lack
        }
        if(isEnough) {
            remainArr = cacheArr.slice(position, len)
        } else {
            const { data } = this._delArrData(remainArr[0], size)
            if(data){
                remainArr[0] = data
            } else {
                remainArr.shift()
            }

        }
        const cache = remainArr.reduce((acc, curr) => {
            acc[curr._id] = curr
            return acc
        }, {})
        this.$cache = cache
        return { 
            id: remainArr[0] ? remainArr[0]._id : null,
        }
    }

    _delArrData (origin, size) {
        const data = clone(origin)
        const keys = arrayKeys(data)
        let lack = size
        if(!keys.length) return { data: null, lack}
        const emptyArrSize = sizeof(JSON.stringify([]))
        let j = 0
        for(; j < keys.length; j++) {
            const key = keys[j]
            const arr = Reflect.get(data, key)
            let cursor = 0
            let isEnough = false
            arr.some((each, index, arr) => {
                cursor = index + 1
                if(sizeof(JSON.stringify(arr.slice(0, cursor))) - emptyArrSize >= lack) {
                    isEnough = true
                    return true
                }
                return false
            })
            if(isEnough) {
                lack = 0
                Reflect.set(data, key, arr.splice(cursor))
                break
            } else {
                lack -= sizeof(JSON.stringify(arr)) - emptyArrSize
                Reflect.set(data, key, [])
            }
        }
        if(j === keys.length && !lack) data = null
        return { data, lack }
    }

    _clearArrData (origin) {
        const data = clone(origin)
        const keys = arrayKeys(data)
        if(keys.length === 0) return
        const val = this._find(data._id)
        keys.forEach((each) => {
            const l1 = data[each].length
            const l2 = val[each].length
            if(l1 > l2) {
                data[each] = val[each].concat(data[each].slice(l1 - l2))
            }
        })
        return data
    }

    _update () {
        window.localStorage.setItem(this.$nameSpace, JSON.stringify(this.$cache))
        this._calculateRemainSize()
    }

    _willOverflow (key, data) {
        let valSize = 0
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
            valSize = diff > 0 ? 0 : this._calculateArrSize(lfuData, val)
        }
        console.log(this.$nameSpace, this.$remainSize, valSize)
        return this.$remainSize < valSize && (valSize - this.$remainSize)
    }

    // 目标数据需要源数据腾出的空间
    _calculateArrSize (target, origin) {
        const tKeys = arrayKeys(target)
        const oKeys = arrayKeys(origin)
        const dKeys = oKeys.filter(each => !tKeys.includes(each))
        const emptyObjSize = sizeof(JSON.stringify({}))
        let total = dKeys.reduce((acc, curr) => {
            const item = {}
            item[curr] = origin[curr]
            acc += sizeof(JSON.stringify(item)) - emptyObjSize, acc
        }, 0)
        total -= tKeys.reduce((acc, curr) => {
            const l1 = target[curr].length
            const l2 = origin[curr] ? origin[curr].length : 0
            if(l1 > l2) {}
        }, 0)
    }

    _calculateRemainSize () {
        this.$remainSize = this.$maxSize - sizeof(window.localStorage.getItem(this.$nameSpace || ''))
    }
}

export default LFUCache