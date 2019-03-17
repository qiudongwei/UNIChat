<docs>
    发送收到的消息
</docs>

<template>
    <div class="message-wraper" :class="type === 1 ? 'reverse' : ''">
        <div class="message-avatar">{{ avatar }}</div>
        <div class="message-main">
            <p class="message-info">
                <span class="message-name">
                    {{ name }}
                </span>
                <span class="message-time">
                    {{ date }} {{ time }}
                </span>
            </p>
            <div class="message-content">
                <p class="message-ctn">
                    {{ msg }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { getAvatar } from '@/js/utils'
export default {
    props: {
        type: {
            type: Number,
            default: 0,
            validator (val) {
                // -1: 接收的消息； 1: 发送的消息
                return val === -1 || val === 1
            }
        },
        msgObj: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        user () {
            return this.$store.getters.user.username
        },
        name () {
            return (this.type === 1 ? this.user : this.msgObj.name) || 'Null'
        },
        msg () {
            return this.msgObj.message || ''
        },
        date () {
            return new Date(this.msgObj.datetime).toLocaleDateString()
        },
        time () {
            return new Date(this.msgObj.datetime).toLocaleTimeString()
        },
        avatar () {
            return getAvatar(this.name)
        }
    }
}
</script>


<style lang="scss" scoped>
    .message-wraper{
        display: flex;
        padding: 10px;
        margin: 10px 0;
    }
    .message-avatar{
        flex-grow: 0;
        width: 30px;
        height: 30px;
        color: #fff;
        background-color: #1E9FFF;
        font-size: 18px;
        font-weight: bold;
        border-radius: 15px;
        text-align: center;
        line-height: 33px;
    }
    .message-main{
        flex-grow: 1;
        margin-left: 10px;
    }
    .message-info{
        display: flex;
        width: 100%;
        height: 20px;
        margin-bottom: 5px;
        line-height: 20px;
        font-size: 12px;
        color: #aaaaaa;
    }
    .message-name{
        margin-right: 10px;
    }
    .message-content{
        display: flex;
    }
    .message-ctn{
        position: relative;
        padding: 7px 10px;
        max-width: 400px;
        font-size: 13px;
        background-color: #D8D8D8;
        border-radius: 3px;
        color: #333;

        &::after{
            content: '';
            position: absolute;
            top: 0;
            left: -10px;
            border: 10px solid transparent;
            border-top-color: #D8D8D8;
        }
    }
    .reverse{
        flex-direction: row-reverse;
        .message-main{
            margin-left: 0;
            margin-right: 10px;
        }
        .message-info, .message-content{
            flex-direction: row-reverse;
        }
        .message-name{
            margin-left: 10px;
            margin-right: 0px;
        }
        .message-ctn{
            color: #ffffff;
            background-color: #62B87A;
             &::after{
                 left: auto;
                 right: -10px;
                 border-top-color: #62B87A;
             }
        }
    }
</style>
