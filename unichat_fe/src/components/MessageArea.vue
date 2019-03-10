<docs>
    UNIChat消息输入框
</docs>

<template>
    <div class="textarea-wraper">
        <textarea class="textarea" @keydown.prevent.enter="sendMessage" v-model="message"></textarea>
    </div>
</template>

<script>
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
            this.$store.commit('setMsgSendCache', {
                message,
                datetime: new Date().getTime()
            })
            this.socket.send(JSON.stringify({
                from,
                to,
                message
            }))
            this.$bus.$emit('send-message')
            this.clearMessage()
        },
        clearMessage () {
            this.message = ''
        }
    },

    created () {
        this.socket = new WebSocket(`ws://localhost:8081/chat/single_chat?uid=${this.user}`)

        this.socket.addEventListener('message', (event) => {
            this.$store.dispatch('receiveMsg', JSON.parse(event.data))
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
