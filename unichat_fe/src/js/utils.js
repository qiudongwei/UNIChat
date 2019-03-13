/**
 * 防抖函数
 * @param {Func} func 执行的函数
 * @param {Number} delay 防抖时间
 * @param {Func} before 防抖钩子：触发前
 */
export const debounce = (func, delay, before) => {
    let timer = null
    delay = delay || 300
    return function (arg) {
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