<template>
<div class="input-finder">
  <span class="selector" v-for="sd in selectedData" :key="sd._id">
    {{sd.name}}
    <em>x</em>
  </span>
  <input type="text"
     v-model="query"
     @input="input"
     @keydown.enter="enter">
</div>
</template>

<script>
export default {
  props: {
    selectedData: {
      type: Array,
      default: []
    },
    queryData: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    enter (val) {
      this.$emit('enter', val)
    },
    input (val) {
      this.$emit('input', val)
    },
    select (val) {
      this.$emit('select', val)
    },
    delete (val) {
      this.$emit('delete', val)
    }
  }
}
</script>
<style lang="less">
.input-finder {
  position: relative;
  padding: 10px;
  border: 1px solid #eee;
  line-height: 1;

  & > input {
    line-height: 1;
    border: none;
    border-bottom: 1px solid #eee;
  }
  .selector {
    display: inline-block;
    cursor: pointer;
    line-height: 2;
    padding: 0 10px;
    margin-right: 10px;
    border-radius: 3px;
    background-color: #eef1f6;

    em {
      font-style: normal;
      display: inline-block;
      font-size: 14px;
      width: 14px;
      text-align: center;
      margin-right: -5px;
      color: #ccc;

      &:hover {
        color: #48576a;
      }
    }
  }
}
</style>
