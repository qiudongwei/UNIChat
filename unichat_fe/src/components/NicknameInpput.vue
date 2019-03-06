<docs>
  昵称输入框
</docs>

<template>
  <div class="input-wraper">
    <input type="text" ref="input" class="common-input"
         v-model="model"
         v-bind="$attrs"
         @blur="blur">
  </div>
</template>

<script>
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
    blur () {
      console.log(this.model)
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
