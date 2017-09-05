<template>
<el-form label-position="right" label-width="105px" class="status-form">
  <el-form-item label="Status Code" class="status-code">
    <el-input v-model="status"></el-input>
  </el-form-item>
  <el-form-item label="Status Text" class="status-text">
    <el-input v-model="statusText"></el-input>
  </el-form-item>
</el-form>
</template>

<script>
export default {
  props: {
    schema: {
      type: Object,
      required: true
    }
  },
  computed: {
    status: {
      get () {
        return this.schema.status
      },
      set (val) {
        this.$emit('change', {
          status: val,
          statusText: this.statusText
        })
      }
    },
    statusText: {
      get () {
        return this.schema.statusText
      },
      set (val) {
        this.$emit('change', {
          status: this.status,
          statusText: val
        })
      }
    }
  }
}
</script>
<style>
.status-form {
  padding-top: 20px;
}
.status-form .el-form-item {
  width: 240px;
  display: inline-block;
}
</style>
