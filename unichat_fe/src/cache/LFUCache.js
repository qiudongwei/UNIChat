/**
 * LFU(最近最久未使用)缓存系统
 */

import { Obj2Node, clone, array2link, link2array, sizeof } from './utils'

class LFUCaache {
    constructor () {}
    init (nameSpace, maxSize) {
        this._NAME_SPACE = nameSpace
        this._MAX_SIZE = maxSize
        this.$data = Object.create(null)
        this._calculateSize()
    }

    set (id, data) {
        const lack = this._willOverflow(id, data)
        if(lack) { // 溢出，先删除
            this._delete(lack)
        }
        if(this._isExit(id)) {
            
            
        } else {
            const val = Object.assign({
                _updatetime: new Date().getTime()
            }, data)
            this.$data.push(val)
        }

        this._update()
    }

    get (id, keys) {
        const data = this.$data.filter(each => each.id === id)
        .map(each => {
            if(!keys) return each
            return keys.reduce((acc, curr) => (
                acc[curr] = each[curr],
                acc
            ), {})
        })
        // 克隆一个新对象，避免被外部修改导致数据污染
        return data.length ? clone(message[0]) : null
    }

    clear () {
        window.localStorage.removeItem(this._NAME_SPACE)
    }

    findIndex (id) {
        return this.$data.findIndex(each => each.id === id)
    }

    find (id) {
        const index = this.findIndex(id)
        return index !== -1 ? this.$data[index] : null
    }

    _isExit (id) {
        return this.$data.filter(each => each.id === id).length ? true : false
    }

    _delete(size) {
        let position = 0
        let lack = 0
        let delArr = null
        let delSize = 0
        const len = this.$data.length
        for(let i = len - 1; i >= 0; i--) {
            delArr = this.$data.slice(i - len)
            delSize = sizeof(JSON.stringify(delArr))
            if(delSize === size) {
                position = i
                lack = 0
                break
            } else if(delSize > size) {
                position = i
                delArr.pop()
                lack = size - sizeof(JSON.stringify(delArr))
                break
            }
        }

        const remainArr = this.$data.slice(0, position)
        let remainData = null

        if(lack) {
            const data = his.$data[position]
            const arrkey = Object.keys(data).some((key) => {
                if(Array.isArray(data[key])) {
                    return true
                }
                return false
            })[0]
            if(arrkey) {
                this.$data[position][arrkey].every((each, index, arr) => {
                    cursor = index + 1
                    delArr = arr.slice(0, cursor)
                    if(sizeof(JSON.stringify(delArr)) >= lack) {
                        return false
                    }
                    return true
                })
                remainData = this.$data[position][arrkey].splice(cursor)
                this.$data[position][arrkey] = remainData
            }
        }

        remainData && remainData.length && (remainArr.push(this.$data[position]))
        this.$data = remainArr
        this._update()
    }

    _update () {
        window.localStorage.setItem(this._NAME_SPACE, JSON.stringify(this.$data))
        this._calculateSize()
    }

    _willOverflow (id, val) {
        let data = this.find(id)
        let dataSize = 0
        if(!data) { // 新数据
            data = Object.assign({
                _updatetime: new Date().getTime()
            }, val)
            dataSize = sizeof(JSON.stringify(data || ''))
        } else {
            const diff = JSON.stringify(data) - JSON.stringify(val)
            dataSize = diff > 0 ? 0 : Math.abs(diff)
        }
        
        return this._remain_size < dataSize && (dataSize - this._remain_size)
    }

    _calculateSize () {
        this._remain_size = this._MAX_SIZE - sizeof(window.localStorage.getItem(this._NAME_SPACE || ''))
    }
}

export default new LFUCaache()