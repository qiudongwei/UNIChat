<docs>
    聊天室
</docs>
<template>
    <div class="room-wraper">
        <div class="room-head">
            <div class="room-head-avatar">W</div>
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
        }
    },

    watch: {
        uid () {
            this.getUserInfo()
        }
    },

    methods: {
        async getUserInfo () {
            const frined = await this.$post('//localhost:8080/user/get_info', {
                uid: this.uid
            })

            if(frined.result === 1) {
                this.frinedName = frined.data.username
            }
        }
    },

    async activated () {
        this.getUserInfo()
    },

    beforeRouteLeave (to, from, next) {
        console.log(from)
        next()
    },

    saveChatRecord () {
        alert(11111)
    },

    activated() {
        console.log(22)
        window.addEventListener('beforeunload', this.saveChatRecord)
    },
    deactivated() {
        window.removeEventListener('beforeunload', this.saveChatRecord)
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
