<docs>
    主页
</docs>

<template>
    <div id="app">
        <div class="container" v-if="user">
            <section class="top-bar">
                <TopBar />
            </section>
            <section class="main-wraper">
                <div class="side-bar">
                    <SideBar />
                </div>
                <div class="main-view">
                    <router-view class='view'></router-view>
                </div>
            </section>
        </div>
        <div class="container" v-else>
            <router-view class='view'></router-view>
        </div>
    </div>
</template>

<script>
import TopBar from '@/components/TopBar'
import SideBar from '@/components/SideBar'
export default {
    components: {
        TopBar,
        SideBar
    },
    computed: {
        user () {
            return this.$store.getters.user
        }
    }
}
</script>


<style lang="scss">
    @import '@/scss/_reset.scss';
    @import '@/scss/_mixins.scss';
    @import '@/scss/_global.scss';
    html { width: 100%; height: 100%; }
    body {
        width: 100%;
        height: 100%;
        min-height: 700px;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #D9D9D9;
        font-size: 16px;
    }
    #app {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
    .container {
        display: flex;
        flex-direction: column;
        width: 1000px;
        height: 600px;
        background-color: #F6F6F6;
        color: #333;
        border-radius: 2px;
        box-shadow: 1px 1px 50px rgba(0,0,0,.3);
    }
    .top-bar {
        flex-grow: 0;
        width: 100%;
        height: 60px;
        background-color: #009688;
    }
    .main-wraper{
        flex-grow: 1;
        display: flex;
        width: 100%;
    }
    .side-bar{
        flex-grow: 0;
        width: 77px;
        background-color: #D5D5D5;
        border-right: 1px solid #dddcdd;
    }
    .main-view {
        flex-grow: 1;
    }
    .view {
        display: flex;
        width: 100%;
        height: 100%;
    }
</style>