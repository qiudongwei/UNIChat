<docs>
    UNIChat消息输入框
</docs>

<template>
    <div class="textarea-wraper">
        <textarea class="textarea" @keydown.prevent.enter="sendMessage" v-model="message"></textarea>
    </div>
</template>

<script>
import * as R from 'ramda'
export default {
    data () {
        return {
            message: '',
            socket: null
        }
    },

    computed: {
        friendId () {
            return this.$route.params.uid
        },

        user () {
            return this.$store.getters.user.uid
        }
    },

    methods: {
        sendMessage (evt) {
            const message = this.message
            const to = this.friendId
            const from = this.user
            const msg = {
                type: 1,
                info: {
                    message,
                    datetime: new Date().getTime()
                }
            }
            this.updateMessages(msg) // 更新消息队列
            this.socket.send(JSON.stringify({
                from,
                to,
                message
            }))
            this.clearMessage()
        },
        clearMessage () {
            this.message = ''
        },
        updateMessages (msg) {
            const messages = this.$store.getters.messages || []
            const msgs = R.append(msg)(messages)
            const getDateTime = R.compose(R.prop('datetime'), R.prop('info'))
            // 按照datetime属性排序
            this.$store.commit('setMessage', R.sortBy(getDateTime)(msgs))
        }
    },

    created () {
        this.socket = new WebSocket(`ws://localhost:8081/chat/single_chat?uid=${this.user}`)

        this.socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data)
            const msg = {
                type: -1,
                info: {
                    datetime: new Date().getTime(),
                    message: data.message,
                    name: data.name
                }
            }
            this.updateMessages(msg)
        })
    }
}
</script>


<style lang="scss" scoped>
    .textarea-wraper{
        width: 100%;
        height: 100%;
    }
    .textarea{
        width: 100%;
        height: 100%;
        background: none;
    }
</style>
