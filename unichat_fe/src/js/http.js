/**
 * 配置axios实例
 * 将axios绑定到vue中
 * 使vue实例可以通过this.$post/ this.$get /this.$http 获取请求函数
 * @Wilton
 */

import Vue from 'vue'
import Axios from 'axios'
import qs from 'qs'

const axios = Axios.create({
    baseURL: '//localhost:8081',
    withCredentials: true, // 要求验证证书
    timeout: 3 * 60 * 1000 // 3min
})

Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const CODE = new Map()
CODE.set(101, '用户名错误')
    .set('default', '未知错误编码')

// 定义拦截器
const interceptors = function (judgeCode) {
    return (respone) => {
        if (judgeCode) { // 处理错误代码
            const code = respone.data.code
            if(code % 100) { // 非整百则表示出错
                const code = [...CODE.keys()].includes(code) ? code : 'default'
                reject(CODE.get(code))
            }
        }
        return respone.data
    }
}

// reject handle
const reject = function (error) {
    let type = 'error',
        message = '服务器出错了，请联系管理员'
    if(error instanceof Error) {
        const errMsg = error.message
        if(/timeout/.test(errMsg)) { // 服务器请求超时
            message = '正在处理你的请求，请稍后查看结果...'
            type = 'warning'
        }
    } else {
        message = error
    }

    console.log(type, message)
    return Promise.reject(error)
}

const createPost = function (url, data = {}, options = {}, judgeCode = true) {
    const postData = qs.stringify(data)

    return axios
        .post(url, postData, options)
        .then(interceptors(judgeCode).bind(this))
        .catch(reject.bind(this))
}

const createGet = function (url, data) {
    const httpGet = data ? axios.get(url, {params: data}) : axios.get(url)
    
    return httpGet
        .then(interceptors.bind(this))
        .catch(reject.bind(this))
}

// 挂在
Object.defineProperties(Vue.prototype, {
    $post: {
        get () {
            return createPost.bind(this)
        }
    },

    $get: {
        get () {
            return createGet.bind(this)
        }
    },

    $axios: {
        get () {
            return axios
        }
    }
})
