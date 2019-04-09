<template>
  <div class="schema schema-edit">
    <el-tabs type="card" class="tabs" v-model="activeTab">
      <el-tab-pane class="tab-item structure" label="Schema" name="structure">
        <params :params="localSchema.params"
                :name="name"
                @updateParams="paramsChanged"></params>
      </el-tab-pane>
      <!-- schema的真正json格式，暂时废弃 -->
      <!-- <el-tab-pane class="tab-item" label="Schema" name="schema">
        <json-editor v-if="activeTab === 'schema'"
              v-model="localSchema"
              :resize-act="fullscreen"
              :fullscreentool="false"
              @change="schemaChanged"></json-editor>
      </el-tab-pane> -->
      <el-tab-pane class="tab-item" :label="exampleName" name="example">
        <Example :schema="localSchema"
                 :fullscreen="fullscreen"
                 :name="exampleName"
                 @buildSchema="updateSchema"
                 @buildExample="updateExample"></Example>
      </el-tab-pane>
      <slot></slot>
    </el-tabs>
  </div>
</template>

<script>
import R from 'ramda'
import JsonEditor from '@/components/common/jsonEditor/Index'
import Params from './params/Index'
import Example from './Example'

export default {
  components: {
    Params,
    Example,
    JsonEditor
  },
  data: () => ({
    activeTab: 'structure'
  }),
  props: {
    name: String,
    exampleName: {
      type: String,
      default: 'Example'
    },
    schema: {
      type: Object,
      required: true
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    localSchema () {
      return R.clone(this.schema)
    }
  },
  methods: {
    schemaChanged (rs) {
      if (rs.success) {
        this.updateSchema(rs.data)
      }
    },
    paramsChanged () {
      this.updateSchema(this.localSchema)
    },
    updateExample (example) {
      this.localSchema.example = example
      this.$emit('change', this.localSchema)
    },
    updateSchema (data) {
      this.$emit('change', data)
    }
  }
}
</script>
<style lang="less">
.schema-content {
  position: relative;
  border-left: 1px solid #d1dbe5;
}
.schema {
  &.schema-edit{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .tabs .el-tabs__item{
    border-top: 0 !important;
    border-radius: 0 !important;
    margin-left: -1px;
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__item {
    height: 36px;
    line-height: 36px;
  }
  .tab-item {
    height: 100%;
  }
  .el-tabs__content {
    position: absolute;
    top: 36px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;

    .structure {
      padding: 10px 20px;
    }
  }
}
</style>
