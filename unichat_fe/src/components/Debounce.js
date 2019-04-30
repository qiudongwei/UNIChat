/**
 * 防抖组件
 */

const debounce = (func, delay, before) => {
  let timer = null
  delay = delay || 300
  return (arg) => {
      if (timer) {
          window.clearTimeout(timer)
      }
      before && before.call(this)
      timer = window.setTimeout(async () => {
          await func.call(this, arg)
          timer = null
      }, delay)
  }
}

const isRegExp = (val) => {
  return Object.prototype.toString.call(val) === '[object RegExp]'
}

const match = (pattern, name) => {
  if(Array.isArray(pattern)) return pattern.includes(name)
  if(typeof pattern === 'string') return new Set(pattern.split(',')).has(name)
  if(isRegExp(pattern)) return pattern.test(name)
  return false
}

export default {
  name: 'Debounce',
  abstract: true,
  props: {
    include: [Array, String, RegExp],
    exclude: [Array, String, RegExp],
    time: [String, Number]
  },
  created () {
    this.debounceMap = new Map
  },
  destroyed () {
    this.debounceMap = Object.create(null)
  },
  render () {
    const vnode = this.$slots.default[0] || null
    const { include, exclude, time } = this
    const evts = Object.keys(vnode.data.on)
    const timer = parseInt(time)
    evts.forEach((each) => {
      if(
        (include && match(include, each)) ||
        (exclude && !match(exclude, each))
      ) {
        this.debounceMap[each] = debounce.call(vnode, vnode.data.on[each], timer)
        vnode.data.on[each] = this.debounceMap[each]
      }
    })
    return vnode
  }
}