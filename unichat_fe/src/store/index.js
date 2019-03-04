/**
 * 状态管理系统
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: window.sessionStorage.user ? JSON.parse(window.sessionStorage.user) : null,
        msgCache: null // 缓存当前发送的信息
    },

    mutations: {
        setUserInfo (state, userinfo) {
            state.user = userinfo.user
            window.sessionStorage.user = JSON.stringify(state.user)
        },
        setMsgCache (state, msg = null) {
            state.msgCache = msg
        }
    },

    actions: {
        login ({ commit }, user) {
            commit('setUserInfo', user)
        }
    },

    getters: {
        user: state => state.user,
        msgCache: state => state.msgCache
    }
})

export default store