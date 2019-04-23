<docs>
  登录/注册
</docs>

<template>
  <div class="login-container">
      <div class="login-wraper">
        <h2 class="login-slogan">Welcome to UNIChat</h2>
        <NicknameInput v-model="nickName" placeholder="输入昵称/登录即注册" />
        <Debounce include="click" time="500">
          <button class="login-btn" @click="login">登录</button>
        </Debounce>
      </div>
  </div>
</template>

<script>
import NicknameInput from '@/components/NicknameInpput'
export default {
  data () {
    return {
      nickName: null
    }
  },
  components: {
    NicknameInput
  },
  methods: {
    async login () {
      if (!this.nickName) return
      console.log(this.nickName)
      return
      const res = await this.$post('//localhost:8080/user/login', {
          username: this.nickName
      })
      if(res.result === 1) {
          const data = res.data
          this.$store.dispatch('login', {
              uid: data.id,
              username: data.name,
              timestamp: new Date().getTime()
          })
          this.$router.push({name: 'CHAT_LIST'})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-container{
    justify-content: center;
    align-items: center;
  }
  .login-wraper{
    width: 320px;
    padding: 30px 0;
    text-align: center;
  }
  .login-slogan{
    padding: 10px 0 30px;
    font-size: 18px;
    color: #009688;
    font-weight: bold;
  }
  .login-btn{
    margin-top: 30px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    background-color: #009688;
    border-radius: 3px;
    color: #ffffff;
    font-weight: bold;
    letter-spacing: 5px;
    cursor: pointer;
  }
</style>
