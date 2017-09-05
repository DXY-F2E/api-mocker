<template>
  <div class="status response-status">
    <div class="control">Status</div>
    <ul>
      <li class="item"
          :class="[(r ? r.status : 0).toString(), {active: activeIndex === key}]"
          v-for="(r, key) in response"
          :key="key"
          @click="changeSchema(key)">
        <span v-if="r">
          <em class="code">{{r.status}}</em>
          <em class="text">[{{r.statusText}}]</em>
        </span>
        <i class="el-icon-close" v-if="response.length > 1" @click.stop="deleteSchema(key)"></i>
      </li>
      <li class="item add" @click="addSchema">
        <i class="el-icon-plus"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['response', 'activeIndex'],
  methods: {
    addSchema () {
      this.$emit('add')
    },
    changeSchema (index) {
      this.$emit('change', index)
    },
    deleteSchema (index) {
      this.$emit('delete', index)
    }
  }
}
</script>
<style lang="less">
.response-status {
  .control {
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-bottom: 1px solid #d1dbe5;
  }
  .item {
    border-bottom: 1px solid #eee;
    padding: 8px 10px;
    cursor: pointer;
    opacity: 0.6;
    height: 36px;
    overflow: hidden;

    em {
      font-style: normal;
    }
    .text {
      color: #333;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      max-width: 92px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:not(.add) {
      &:before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 10px;
        border-radius: 50%;
        vertical-align: middle;
      }

      i {
        position: absolute;
        right: 10px;
        color: red;
        font-size: 12px;
        width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        display: none;
        transform: scale(0.8);
        margin-top: 2px;
        border-radius: 3px;

        &:hover {
          background-color: #fbcbcb;
        }
      }
    }

    &:before {
      background-color: #333;
    }
    &.active,
    &:hover {
      opacity: 1;
      color: #666;
    }
    &.active {
      background-color: #fafafa;
    }
    &:hover i {
      display: inline-block;
    }
    &.add {
      text-align: center;
      &:hover {
        background-color: #f8f8f8;
      }
    }
  }
  [class^='item 5']:before,
  [class^='item 4']:before{
    background-color: red;
  }
  [class^='item 3']:before{
    background-color: #f5a623;
  }
  [class^='item 2']:before{
    background-color: #3eb63e;
  }
  [class^='item 1']:before{
    background-color: #aaa;
  }
}
</style>
