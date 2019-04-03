<docs>
    聊天区
</docs>

<template>
    <div class="chat-wraper">
        <Message v-for="(item, index) in msgs" 
            :key="index"
            :type="item.type"
            :msgObj="item.info"
        />
    </div>
</template>

<script>
import Message from '@/components/Message'
import * as R from 'ramda'
export default {
    components: {
        Message
    },
    data () {
        return {
            messages: {}
        }
    },
    computed: {
        uid () {
            return this.$route.params.uid
        },
        user () {
            return this.$store.getters.user.uid
        },
        msgs () {
            const messages = this.messages.records || []
            return R.concat(messages || [])(this.$store.getters.messages || [])
        },
        msgSendCache () {
            return this.$store.getters.msgSendCache
        }
    },
    watch: {
        uid () {
            this.messages = null
            this.getChatRecords()
        }
    },
    methods: {
        getChatRecords () {
            const messages = this.$msgCache.get(this.uid) || {}
            this.messages = messages
        }
    },
    activated () {
        this.getChatRecords()
    }
}
</script>


<style lang="scss" scoped>
    .chat-wraper{
        width: 100%;
    }
</style>

