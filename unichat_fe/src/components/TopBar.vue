<docs>
    顶栏
</docs>

<template>
    <div class="top-wraper">
        <div class="trademark">
            <div class="trademark-logo">UNI</div>
            <p class="trademark-name">UNIChat</p>
        </div>
        <div class="search"></div>
    </div>
</template>

<style lang="scss" scoped>
    .top-wraper {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: space-between;
        align-items: center;
    }
    .trademark {
        display: flex;
        margin-left: 20px;
        height: 40px;
        &-logo{
            width: 40px;
            height: 40px;
            margin-right: 10px;
            background-color: #5FB878;
            border-radius: 20px;
            line-height: 44px;
            color: #ffffff;
            text-align: center;
            font-weight: bold;
        }
        &-name{
            font-size: 18px;
            font-weight: bold;
            color: #fff;
            line-height: 45px;
        }
    }
</style>

