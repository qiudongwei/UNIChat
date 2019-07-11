<docs>
  昵称输入框
</docs>

<template>
  <div class="input-wraper">
    <Throttle time="1000" :before="before">
      <input type="text" ref="input" class="common-input"
          v-model="model"
          @input = "myinput"
          v-bind="$attrs">
    </Throttle>
  </div>
</template>

<script>
import { debounce } from '../js/utils'
export default {
  props: {
    value: null
  },
  computed: {
    model: {
      get () {
        return this.value
      },

      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    checkNickName: debounce(function () {
      console.log('Checking unique NickName: ',this.model)
    }, 500),

    myinput (val) {
      console.log(val.target.value)
    },

    before () {
      console.log('before...')
    }
  }
}
</script>

<style>
  .input-wraper{
    padding: 0px 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  .common-input{
    width: 100%;
    height: 30px;
    padding: 5px 0px;
    outline: none;
    background: none;
    font-size: 14px;
  }
</style>
