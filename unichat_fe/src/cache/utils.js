/**
 * 工具库 
 */

export const isObject = (obj) => {
    return Object.prototype.toString.apply(obj) === '[object Object]'
}

export const Obj2Node = (obj, model, keys) => {
    return new model(...keys
        .map(each => obj[each]))
}

export const clone = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

export const array2link = (arr, model, keys) => {
    const head = new model()
    let cursor = head
    arr.forEach(each => {
        const node = Obj2Node(each, model, keys)
        cursor.next = node
        node.prev = cursor
        cursor = node
    })
    return head.next
}

export const link2array = (head, keys) => {
    const arr = []
    while(head) {
        arr.push(keys.reduce((acc, curr) => {
            acc[curr] = head[curr]
            return acc
        }, {}))
        head = head.next
    }
    return arr
}