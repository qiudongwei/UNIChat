/**
 * 工具库 
 */

export const isObject = (obj) => {
    return Object.prototype.toString.apply(obj) === '[object Object]'
}

export const Obj2Node = (obj, model, keys) => {
    return new model(...keys
        .map(each => obj[each] || null))
}

export const clone = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

export const array2link = (arr, model, keys) => {
    let head = new model()
    let cursor = head
    arr.forEach(each => {
        const node = Obj2Node(each, model, keys)
        cursor.next = node
        node.prev = cursor
        cursor = node
    })
    head = head.next
    head && (head.prev = null)
    return head
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

export const sizeof = (str, charset) => {
    if(!str) return 0
    let total = 0,
        i, len, charCode
    charset = charset ? charset.toLowerCase() : '';
    if(charset === 'utf-16' || charset === 'utf16') {
        for(i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i)
            if(charCode <= 0xffff){
                total += 2;
            }else{
                total += 4;
            }
        }
    } else {
        for(i = 0, len = str.length; i < len; i++){
            charCode = str.charCodeAt(i);
            if(charCode <= 0x007f) {
                total += 1;
            }else if(charCode <= 0x07ff){
                total += 2;
            }else if(charCode <= 0xffff){
                total += 3;
            }else{
                total += 4;
            }
        }
    }
    return total
}

export const arrayKeys = (obj) => {
    return Object.keys(obj).filter((key) => Array.isArray(obj[key]))
}