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
            message: ''
        }
    },

    methods: {
        sendMessage (evt) {
            const message = this.message
            this.$store.commit('setMsgCache', {
                message,
                datetime: new Date().getTime()
            })
            this.$bus.$emit('send-message')
            this.clearMessage()
        },
        clearMessage () {
            this.message = ''
        }
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
