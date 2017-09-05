<template>
  <el-form-item :label="item.label" class="profile-item">
    <template v-if="mode === 'read'">
      <span class="value">{{user[item.key]}}</span>
      <el-button type="text" class="edit" icon="edit" @click="mode = 'edit'">修改</el-button>
    </template>
    <template v-else>
      <el-input :value="user[item.key]"
           size="small"
           @change="handleValueChange" />
      <span>
        <el-button size="small" type="primary" @click="updateProfile">保存</el-button>
        <el-button size="small" @click="mode = 'read'">取消</el-button>
      </span>
    </template>
  </el-form-item>
</template>

<script>
import R from 'ramda'
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      mode: 'read',
      tempValue: this.item.value
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    validateEmail () {
      const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!reg.test(this.tempValue)) {
        this.$message.error('邮箱格式错误')
        return false
      } else {
        return true
      }
    },
    validate () {
      if (!this.tempValue) {
        this.$message.error(`${this.item.label}不能为空`)
        return false
      }
      return this.item.key === 'email' ? this.validateEmail() : true
    },
    handleValueChange (val) {
      this.tempValue = val
    },
    updateProfile () {
      if (!this.validate()) { return }
      const data = R.clone(this.user)
      data[this.item.key] = this.tempValue
      this.$store.dispatch('updateProfile', data).then(() => {
        this.mode = 'read'
        this.$message.success('保存成功')
      })
    }
  }
}
</script>
<style lang="less">
.profile-item {
  padding: 10px 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
  .edit {
    margin-left: 20px;
    display: none;
    /*color: #ccc;*/
    .el-icon-edit {
      font-size: 12px;
    }
  }
  &:hover .edit {
    display: inline-block;
  }
  .el-input {
    width: 200px;
    margin-right: 20px;
  }
}
</style>
