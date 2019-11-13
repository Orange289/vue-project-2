<template>
  <div class="m-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Container'
}
</script>

<style lang="scss" scoped>
.m-container {
  position: relative;
  width: 100%;
  margin: auto;
  max-width: 960px;
  padding-left: 53px;
  padding-right: 53px;

  @include bp(tablet) {
    width: 100%;
    padding: 0;
  }
}
</style>
