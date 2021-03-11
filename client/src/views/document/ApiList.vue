<template>
  <div ref="apiList" class="apis el-col" v-if="groups" v-drag="dragOption" :class="$route.name">
    <el-menu
      :default-active="$route.params.apiId"
      :default-openeds="defaultOpeneds"
      class="el-menu-vertical"
      :router="true"
    >
      <el-submenu v-if="group" :index="group._id" class="group active-group">
        <template slot="title">{{getGroupParentName(group)}}{{ getGroupParentName(group) ? ' / ' : '' }}{{group.name}}</template>
        <el-menu-item
          v-for="api in apis"
          v-scroll="api._id === $route.params.apiId"
          :index="api._id"
          :route="{ name: 'ApiDoc', params: { groupId: group._id, apiId: api._id}}"
          :key="api._id"
          class="api"
        >
          <label class="method" :class="api.options.method">{{api.options.method.toUpperCase()}}</label>
          <span class="api-name" :class="{'line-through': [2,3].includes(api.status)}">{{api.name}}</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-for="g in groups" :key="g._id" :class="['group', g._id === $route.params.groupId ? 'heightlight' : '']" :index="'/doc/'+g._id">
        {{getGroupParentName(g)}}{{ getGroupParentName(g) ? ' / ' : '' }}{{g.name}}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: ['apis'],
  data () {
    return {
      dragOption: {
        value: +localStorage.getItem('menu-width'),
        onChange (val) { localStorage.setItem('menu-width', val) }
      }
    }
  },
  computed: {
    defaultOpeneds () {
      return this.group ? [this.group._id] : []
    },
    groups () {
      // return this.$store.state.groups
      const groups = this.$store.state.groups
      groups.forEach(g => {
        g.parents = this.getParent(g, groups)
      })
      return groups
    },
    group () {
      return this.groups.find(g => g._id === this.$route.params.groupId)
    }
  },
  methods: {
    getGroupParentName (group) {
      const name = `${group.parents.map(g => g.name).join(' / ')}`
      return name.startsWith(' /') ? name.substr(3, name.length) : name
    },
    getParent (g, groups) {
      let res = []
      if (g.pGroup) {
        const parent = groups.find(group => group._id === g.pGroup)
        if (parent) res.push(parent)
        if (parent && parent.pGroup) res = [...this.getParent(parent, groups), ...res]
      }
      return res
    },
    showApiDoc (api) {
      const { groupId, apiId } = this.$route.params
      if (api._id === apiId) {
        return
      }
      this.$router.push(`/doc/${groupId}/${api._id}`)
    }
  }
}
</script>
<style lang="less">
.apis {
  position: relative;
  transition: width 0.4s ease;
  width: 288px;
  min-width: 288px;
  background-color: #f8f8f8;
  flex-shrink: 0;
  .heightlight {
    background-color: #ecf5ff;
  }

  &.AllDoc {
    width: 100%;
    padding: 30px;
    display: block !important;

    .group {
      display: inline-block;
      margin: 20px;
      cursor: pointer;
    }
  }

  .el-submenu {
    .el-menu {
      background-color: #f8f8f8;
    }
    .api {
      height: 36px;
      line-height: 36px;
      padding: 0 20px !important;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .el-menu-item.api:hover {
      background-color: #eee;
    }
  }

  .el-menu {
    background-color: #f8f8f8;
  }
  .el-menu-item-group__title {
    margin-bottom: 20px;
  }
  .method {
    display: inline-block;
    width: 44px;
    text-align: right;
    margin-right: 8px;
    font-size: 12px;
  }
  .api-name {
    vertical-align: middle;
    // display: inline-block;
  }
}
</style>
