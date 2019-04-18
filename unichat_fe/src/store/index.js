/**
 * 状态管理系统
 */
import Vue from 'vue'
import Vuex from 'vuex'
// import * as R from 'ramda'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: window.sessionStorage.user ? JSON.parse(window.sessionStorage.user) : null,
        chat: null, // 当前聊天好友ID
        messages: null, // 缓存聊天记录
        historyMessage: {} // 历史聊天记录
    },

    mutations: {
        setUserInfo (state, userinfo) {
            state.user = userinfo
            window.sessionStorage.user = JSON.stringify(state.user)
        },
        setChat (state, chat) {
            state.chat = chat
        },
        setMessage (state, messages) {
            state.messages = messages
        },
        setHistoryMessage (state, { uid, messages }) {
            Reflect.set(state.historyMessage, uid, messages || [])
        }
    },

    actions: {
        login ({ commit }, user) {
            commit('setUserInfo', user)
        }
    },

    getters: {
        user: state => state.user,
        chat: state => state.chat,
        messages: state => state.messages,
        historyMessage: state => state.historyMessage
    }
})

export default store