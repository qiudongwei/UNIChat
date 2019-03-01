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
            messages: [{
                type: -1,
                info: {
                    name: 'Wilton',
                    datetime: 1551435672325,
                    message: '摸鱼吗？'
                }
            },{
                type: 1,
                info: {
                    datetime: 1551435672323,
                    message: '是呢！一起吗？'
                }
            }]
        }
    },
    computed: {
        msgs () {
            const getDateTime = R.compose(R.prop('datetime'), R.prop('info'))
            // 按照datetime属性排序
            return R.sortBy(getDateTime)(this.messages)
        },
        msgCache () {
            return this.$store.getters.msgCache
        }
    },
    created () {
        this.$bus.$on('send-message', () => {
            this.messages = R.append({
                type: 1,
                info: R.clone(this.msgCache)
            })(this.messages)
            // this.messages.push({
            //     type: 1,
            //     info: R.clone(this.msgCache)
            // })
            console.log(this.messages)
        })
    }
}
</script>


<style lang="scss" scoped>
    .chat-wraper{
        width: 100%;
    }
</style>

