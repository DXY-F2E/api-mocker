<template>
  <div class="page-layout">
    <div class="page-nav">
      <slot name="nav"></slot>
    </div>
    <div class="page-view">
      <slot name="view"></slot>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.page-layout {
  display: flex;
  height: 100%;

  .page-nav {
    width: 280px;
    background-color: #eef1f6;
    overflow-y: auto;
  }

  .page-view {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
}
</style>
