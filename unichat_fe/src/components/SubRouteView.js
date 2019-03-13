/* <docs>
    一级路由父组件，用于将子路由设为keepAlive
</docs>

<template>
    <transition name='router' mode='out-in'>
        <keep-alive :exclude=/nokeep/i>
            <router-view class='view'></router-view>
        </keep-alive>
    </transition>
</template> */

export default function() {
    return {
        template: `
                <transition name='router' mode='out-in'>
                    <keep-alive :exclude=/nokeep/i>
                        <router-view class='view'></router-view>
                    </keep-alive>
                </transition>`,
        name: 'subRouteView'
    }
}
