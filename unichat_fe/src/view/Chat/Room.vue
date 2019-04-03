<docs>
    聊天室
</docs>
<template>
    <div class="room-wraper">
        <div class="room-head">
            <div class="room-head-avatar">{{ avatar }}</div>
            <div class="room-head-info">
                <p class="room-head-name">{{ frinedName }}</p>
                <div class="room-head-status active">在线</div>
            </div>
        </div>
        <div class="room-body">
            <ChatArea />
        </div>
        <div class="room-foot">
            <div class="room-foot-bar">
                <button class="room-foot-facial"><i class="iconfont">&#xe64f;</i></button>
            </div>
            <div class="room-foot-input">
                <MessageArea />
            </div>
            <div class="room-foot-send">
                <button class="room-foot-submit">发送</button>
            </div>
        </div>
    </div>
</template>

<script>
import { getAvatar } from '@/js/utils'
import MessageArea from '@/components/MessageArea'
import ChatArea from '@/components/ChatArea'
export default {
    components: {
        MessageArea,
        ChatArea
    },

    data () {
        return {
            frinedName: null
        }
    },

    computed: {

        uid () {
            return this.$route.params.uid
        },

        avatar () {
            return getAvatar && getAvatar(this.frinedName)
        },

        chat () {
            return this.$store.getters.chat
        }
    },

    watch: {
        uid (curr, prev) {
            this.saveChatRecord(prev, this.chat.uname)
            this.getUserInfo()
            this.$store.commit('setMessage', null)
        }
    },

    created () { // 页面刷新时从缓存中获取激活用户
        const friend = this.$userCache.get('active')
        if(friend) {
            this.$store.commit('setChat', friend)
        }
    },

    methods: {
        async getUserInfo (uid) {
            const frined = await this.$post('//localhost:8080/user/get_info', {
                uid: uid || this.uid
            })

            if(uid) {
                return frined
            }

            if(frined.result === 1) {
                this.frinedName = frined.data.username
            }
            this.saveActiveUser()
        },
        saveActiveUser () {
            // 保存激活中的用户
            const chat = {
                uid: this.uid,
                uname: this.frinedName
            }
            this.$store.commit('setChat', chat)
            this.$userCache.set('active', chat)
        },
        clearActiveUser () {
            this.$store.commit('setChat', null)
            this.$userCache.remove('active')
        },
        saveChatRecord (uid, uname) {
            const messages = this.$store.getters.messages || []
            if(!messages.length) return
            this.$msgCache.set(uid || this.uid, {
                uid: this.uid,
                uname: uname || this.frinedName,
                records: messages
            })
        },
        beforeunload () {
            this.saveActiveUser()
            this.saveChatRecord()
        }
    },

    activated () {
        this.getUserInfo()
        window.addEventListener('beforeunload', this.beforeunload)
    },

    beforeRouteLeave (to, from, next) {
        this.clearActiveUser()
        this.saveChatRecord()
        this.$store.commit('setMessage', null)
        next()
    },

    deactivated() {
        window.removeEventListener('beforeunload', this.beforeunload)
    }
}
</script>

<style lang="scss" scoped>
    webkit,::-webkit-scrollbar{width: 0;}
    .room-wraper{
        flex-direction: column;
    }

    .room-head{
        flex-grow: 0;
        display: flex;
        align-items: center;
        height: 60px;
        padding: 7px 10px;
        background-color: #EBEBEB;

        &-avatar{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            margin-right: 10px;
            border-radius: 20px;
            background-color: #1E9FFF;
            font-style: 20px;
            font-weight: bold;
            color: #fff;
        }

        &-info{
            flex-grow: 1;
            height: 40px;
        }

        &-name{
            padding-bottom: 5px;
            font-size: 16px;
            color: #333333;
        }

        &-status{
            font-size: 14px;
            color: #aaa;
        }

        .active{
            color: #62B87A;
        }
    }

    .room-body{
        flex-grow: 1;
        display: flex;
        flex-direction: column-reverse;
        overflow-y: scroll;
        overflow-x: hidden;

        &.reverse{
            flex-direction: column-reverse;
        }
    }

    .room-foot{
        flex-grow: 0;
        height: 130px;
        border-top: 1px solid #E7E7E7;

        &-bar{
            display: flex;
            height: 25px;
            padding-top: 5px;
            padding-left: 20px;
        }

        &-facial{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 15px;
            height: 15px;
            background: none;
            color: #aaaaaa;
            cursor: pointer;
        }
        .iconfont{
            font-size: 22px;
        }

        &-input{
            display: flex;
            height: 60px;
            margin-top: 5px;
            padding: 0 10px;
        }

        &-send{
            text-align: right;
        }

        &-submit{
            width: 70px;
            height: 30px;
            position: relative;
            top: -20px;
            margin-right: 10px;
            border-radius: 5px;
            font-size: 16px;
            color: #fff;
            text-align: center;
            line-height: 33px;
            background-color: #62B87A;
            cursor: pointer;
        }
    }
</style>
