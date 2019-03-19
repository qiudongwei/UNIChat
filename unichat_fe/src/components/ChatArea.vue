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
            records: null
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
            const records = this.records || []
            return R.concat(records || [])(this.$store.getters.messages || [])
        },
        msgSendCache () {
            return this.$store.getters.msgSendCache
        }
    },
    watch: {
        uid () {
            this.records = null
            this.getChatRecords()
        }
    },
    methods: {
        getChatRecords () {
            const records = this.$cache.get(this.uid)
            this.records = records
        }
    },
    activated () {
        console.log('chat area active...')
        this.getChatRecords()
    }
}
</script>


<style lang="scss" scoped>
    .chat-wraper{
        width: 100%;
    }
</style>

