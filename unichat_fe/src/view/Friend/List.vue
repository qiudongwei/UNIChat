<docs>
    好友列表
</docs>
<template>
    <div>
        <div class="chat-list">
            <router-link class="chat-list-item" v-for="(val, key, index) in friends" :key="index" :class="isActive(val) ? 'active' : '' " :to="{name: 'FRIEND_DETAIL', params: {uid: val}}">
                <div class="chat-list-wraper">
                    <div class="chat-list-avatar">{{ getAvatar(key) }}</div>
                    <div class="chat-list-info">
                        <p class="chat-list-name">{{ key }}</p>
                    </div>
                </div>
            </router-link>
        </div>
        <div class="chat-room">
            <div class="chat-room-placeholder" v-if="isFriendList">
                什么？一条咸鱼也没有。。。
            </div>
            <template v-else>
                <keep-alive :exclude=/nokeep/i>
                    <router-view class='view'></router-view>
                </keep-alive>
            </template>
        </div>
    </div>
</template>

<script>
import { getAvatar } from '@/js/utils'
export default {
    data () {
        return {
            friends: []
        }
    },
    computed: {
        uid () {
            return this.$route.params.uid || ''
        },

        isFriendList () {
            return this.$route.name === 'FRIEND_LIST'
        }
    },

    methods: {
        isActive (uid) {
            return this.uid === uid
        },

        getAvatar: getAvatar,

        async getFriendList () {
            const data = await this.$post('//localhost:8080/user/get_friends')
            if(data.result === 1) {
                this.friends = data.data
            }
        }
    },

    created () {
        this.getFriendList()
    }
}
</script>


<style lang="scss" scoped>
    .chat-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 280px;
        padding: 5px;
        background-color: #D8D8D8;

        &-item {
            width: 100%;
            padding: 5px 0;
            border-radius: 5px;
            margin-bottom: 3px;
            border-bottom: 1px solid #dfdfdf;
            &:hover {
                background-color: #F1F1F1;
            }
        }
        .active {
            background-color: #F3F3F3;
        }

        &-wraper {
            display: flex;
            align-items: center;
            height: 40px;
            padding: 0 5px;
        }

        &-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-grow: 0;
            width: 30px;
            height: 30px;
            color: #fff;
            background-color: #1E9FFF;
            font-size: 18px;
            font-weight: bold;
            border-radius: 15px;
        }

        &-info {
            flex-grow: 1;
            margin: 0 5px 0 10px;
        }

        &-name {
            font-size: 14px;
            color: #333;
        }
    }

    .chat-room {
        flex-grow: 1;
        height: 100%;

        &-placeholder {
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #ccc;
        }
    }
</style>