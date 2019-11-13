<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'container'
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  // width: 100%;
  width: $container-max-width;
  margin: auto;
  padding-left: 30px;
  padding-right: 30px;

  @include bp(tablet) {
    width: 100%;
    max-width: 1410px;
    padding-left: 42px;
    padding-right: 42px;
  }
}
</style>
