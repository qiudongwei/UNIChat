import Vue from 'vue'
import VueRouter from 'vue-router'

import SubRouteView from '@/components/SubRouteView'

// chat component
const ChatListModule = () => import(/* webpackChunkName: "chat" */ '@/view/Chat/List')
const ChatRoomModule = () => import(/* webpackChunkName: "chat" */ '@/view/Chat/Room')

// friend component
const FriendListModule = () => import(/* webpackChunkName: "friend" */ '@/view/Friend/List')
const FriendDetailModule = () => import(/* webpackChunkName: "friend" */ '@/view/Friend/Detail')

const routes = [{
    path: '',
    redirect: '/chat'
},{
    path: '/chat',
    component: SubRouteView,
    children: [{
        path: '',
        name: 'CHAT_LIST',
        component: ChatListModule,
        meta: {
            title: '待摸鱼'
        }
    },{
        path: 'room/:uid',
        component: ChatListModule, // 渲染在List的Route-View中
        children: [{
            path: '',
            name: 'CHAT_ROOM',
            component: ChatRoomModule,
            meta: {
                title: '摸鱼中'
            }
        }]
    }]
},{
    path: '/friend',
    component: SubRouteView,
    meta: {
        title: '咸鱼们'
    },
    children: [{
        path: '',
        name: 'FRIEND_LIST',
        component: FriendListModule,
    },{
        path: 'detail/:uid',
        name: 'FRIEND_DETAIL',
        component: FriendDetailModule,
    }]
}]

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes
})

/**
 * 设置beforeEach钩子用于登录操作、title设置
 */
router.beforeEach(async (to, from, next) => {
    const vm = router.app // vue实例
    if (!vm._isMounted) { // 首次访问
        const res = await vm.$post('//localhost:8080/user/login', {
            uid: '登录用户'
        })
        if(res.result === 1) {
            const data = res.data
            vm.$store.dispatch('login', {
                user: data.uid,
                timestamp: new Date().getTime()
            })
        }
    }

    const title = to.meta.title || 'UNIChat'
    document.title = title
    next()
})

export default router