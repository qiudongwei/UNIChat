/**
 * 状态管理系统
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as R from 'ramda'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: window.sessionStorage.user ? JSON.parse(window.sessionStorage.user) : null,
        msgSendCache: null, // 缓存当前发送的信息
        msgReceiveCache: [], // 缓存当前接受的信息
        chat: null, // 当前聊天好友ID
    },

    mutations: {
        setUserInfo (state, userinfo) {
            state.user = userinfo
            window.sessionStorage.user = JSON.stringify(state.user)
        },
        setMsgSendCache (state, msg = null) {
            state.msgSendCache = msg
        },
        setMsgReceiveCache (state, msg = null) {
            state.msgReceiveCache = R.append(msg)(state.msgReceiveCache)
        },
        setChat (state, chat) {
            console.log(chat)
            state.chat = chat
        }
    },

    actions: {
        login ({ commit }, user) {
            commit('setUserInfo', user)
        },

        receiveMsg ({ commit }, msg) {
            commit('setMsgReceiveCache', Object.assign({
                type: -1,
                datetime: new Date().getTime()
            }, msg))
        }
    },

    getters: {
        user: state => state.user,
        msgSendCache: state => state.msgSendCache,
        msgReceiveCache: state => state.msgReceiveCache,
        chat: state => state.chat
    }
})

export default store