<docs>
    好友明细
</docs>
<template>
    <div class="detail">
        <div class="detail-wraper">
            <div class="detail-avatar">{{ avatar }}</div>
            <p class="detail-name">{{ frinedName }}</p>
            <router-link class="detail-btn" :to="{name: 'CHAT_ROOM', params:{uid: 'd0177d5f5d938bbbb5c6dcd9917bc565'}}">发送消息</router-link>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            frinedName: null
        }
    },
    computed: {
        uid () {
            return this.$route.params.uid || ''
        },
        avatar () {
            return this.frinedName ? this.frinedName.slice(0,1) : 'N'
        }
    },
    watch: {
        uid () {
            console.log('detail')
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
            } else {
                this.frinedName = null
            }
        }
    },

    async activated () {
        this.getUserInfo()
    }
}
</script>


<style lang="scss" scoped>
    .detail{
        align-items: center;
        justify-content: center;

        &-wraper{
            width: 260px;
            text-align: center;
        }

        &-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-grow: 0;
            width: 50px;
            height: 50px;
            margin: 0 auto;
            color: #fff;
            background-color: #1E9FFF;
            font-size: 22px;
            font-weight: bold;
            border-radius: 25px;
        }

        &-name{
            padding: 10px 0;
            margin: 0 auto;
            color: #333;
        }

        &-btn{
            display: block;
            margin: 0 auto;
            margin-top: 30px;
            width: 180px;
            height: 40px;
            line-height: 45px;
            text-align: center;
            font-size: 16px;
            background-color: #62B87A;
            border-radius: 3px;
            color: #f1f1f1;
            font-weight: bold;
            letter-spacing: 5px;
            cursor: pointer;
        }
    }
</style>
