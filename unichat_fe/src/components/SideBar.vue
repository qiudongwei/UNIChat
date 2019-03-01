<docs>
    侧边导航栏
</docs>
<template>
    <div class="side-wraper">
        <nav class="navs">
            <li class="navs-item">
                <router-link :to="{name: 'CHAT_LIST'}">
                    <i class="iconfont" :class="/chat/.test(routePath) ? 'open': '' ">&#xe610;</i>
                </router-link>
            </li>
            <li class="navs-item">
                <router-link :to="{name: 'FRIEND_LIST'}">
                    <i class="iconfont" :class="/friend/.test(routePath) ? 'open': '' ">&#xe60a;</i>
                </router-link>
            </li>
            <li class="navs-item">
                <router-link :to="{name: 'CHAT_LIST'}">
                    <i class="iconfont" :class="/me/.test(routePath) ? 'open': '' ">&#xe64d;</i>
                </router-link>
            </li>
        </nav>
    </div>
</template>

<script>
export default {
    computed: {
        routePath () {
            return this.$route.path
        }
    }
}
</script>


<style lang="scss" scoped>
    .navs {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding-top: 20px;

        &-item {
            margin-bottom: 30px;
            
            .iconfont {
                font-size: 28px;
                color: #bfbfbf;
            }

            .open {
                color: #5FB878;
            }
        }
    }
</style>
