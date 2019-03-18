<docs>
    会话列表
</docs>
<template>
    <div>
        <div class="chat-list">
            <router-link class="chat-list-item" v-for="(chat, index) in chats" :key="index" :class="isActive(chat.uid) ? 'active' : '' " :to="{name: 'CHAT_ROOM', params: {uid: chat.uid}}">
                <div class="chat-list-wraper">
                    <div class="chat-list-avatar">{{ getAvatar(chat.uname) }}</div>
                    <div class="chat-list-info">
                        <p class="chat-list-name">{{ chat.uname }}</p>
                        <p v-show="!isActive(chat.uid)" class="chat-list-msg">{{ chat.latestMsg || '最新消息' }}</p>
                    </div>
                    <span v-show="!isActive(chat.uid)" class="chat-list-time">{{ chat.latestTime || '最新时间' }}</span>
                </div>
            </router-link>
        </div>
        <div class="chat-room">
            <div class="chat-room-placeholder" v-if="isChatList">
                那个。。。一起摸鱼吗？哈...？
            </div>
            <template v-else>
                <keep-alive :exclude=/nokeep/i>
                    <router-view class='view'></router-view>
                </keep-alive>
            </template>
        </div>
    </div>
</template>

<script>
import * as R from 'ramda'
import { getAvatar } from '@/js/utils'
export default {
    data () {
        return {
            chatList: null
        }
    },
    computed: {
        uid () {
            return this.$route.params.uid || ''
        },

        isChatList () {
            return this.$route.name === 'CHAT_LIST'
        },

        chat () {
            return this.$store.getters.chat
        },

        routeName () {
            return this.$route.name
        },

        chats () {
            const chat = this.chat ? [this.chat] : []
            const chatList = this.chatList || []
            return R.concat(chat)(chatList.map(each => {
                const date = new Date(each.data.info.datetime)
                return {
                    uid: each.uid,
                    uname: each.uname,
                    latestMsg: each.data.info.message,
                    latestTime: (Date.now() - each.data.info.datetime) > 24 * 12 * 60 * 60 * 100 ? date.toLocaleDateString() : date.toLocaleTimeString()
                }
            }))
        }
    },

    watch: {
        routeName (curr, prev) {
            if(prev === 'CHAT_ROOM') {
                this.getChatList()
            }
        }
    },

    methods: {
        isActive (uid) {
            return this.uid === uid
        },

        getAvatar: getAvatar,

        getChatList () {
            this.chatList = this.$cache.getChatList('MESSAGE')
        }
    },

    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.getChatList()
            // vm.chatList = vm.$cache.getChatList('MESSAGE')
        })
    }
}
</script>


<style lang="scss" scoped>
    .chat-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 280px;
        padding: 5px;
        background-color: #D8D8D8;

        &-item {
            width: 100%;
            padding: 5px 0;
            border-radius: 5px;
            margin-bottom: 3px;
            border-bottom: 1px solid #dfdfdf;
            &:hover {
                background-color: #F1F1F1;
            }
        }
        .active {
            background-color: #F3F3F3;
        }

        &-wraper {
            display: flex;
            align-items: center;
            height: 40px;
            padding: 0 5px;
        }

        &-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-grow: 0;
            width: 30px;
            height: 30px;
            color: #fff;
            background-color: #1E9FFF;
            font-size: 18px;
            font-weight: bold;
            border-radius: 15px;
        }

        &-info {
            flex-grow: 1;
            margin: 0 5px 0 10px;
        }

        &-name {
            padding-bottom: 5px;
            font-size: 14px;
            color: #333;
        }

        &-msg {
            color: #999;
            font-size: 12px;
        }

        &-time {
            flex-grow: 0;
            position: relative;
            top: -10px;
            width: 80px;
            text-align: right;
            font-size: 12px;
            color: #aaa;
        }
    }

    .chat-room {
        flex-grow: 1;
        height: 100%;

        &-placeholder {
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #ccc;
        }
    }
</style>
