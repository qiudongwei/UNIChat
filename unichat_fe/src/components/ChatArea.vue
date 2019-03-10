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
            messages: []
        }
    },
    computed: {
        uid () {
            return this.$route.params.uid
        },
        user () {
            return this.$store.getters.user.uid
        },
        receivedMsg () {
            return this.$store.getters.msgReceiveCache.filter(each => 
                [this.uid, this.user].includes(each.from)
            ).map(each => {
                return {
                    type: each.type,
                    info: {
                        datetime: each.datetime,
                        name: each.name,
                        message: each.message
                    }
                }
            })
        },
        msgs () {
            const messages = R.concat(this.messages)(this.receivedMsg)
            const getDateTime = R.compose(R.prop('datetime'), R.prop('info'))
            // 按照datetime属性排序
            return R.sortBy(getDateTime)(messages)
        },
        msgSendCache () {
            return this.$store.getters.msgSendCache
        }
    },
    created () {
        this.$bus.$on('send-message', () => {
            this.messages = R.append({
                type: 1,
                info: R.clone(this.msgSendCache)
            })(this.messages)
        })
    }
}
</script>


<style lang="scss" scoped>
    .chat-wraper{
        width: 100%;
    }
</style>

