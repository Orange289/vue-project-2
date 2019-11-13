<template>
  <div class="small-header">
    <container>
      <a class="small-header__logo" href="/">
        <svg ><use xlink:href="#sprite-logo"></use></svg>
      </a>
    </container>
  </div>
</template>

<script>
export default {
  name: 'SmallHeader'
}
</script>

<style lang="scss" scoped>
.small-header {
  position: absolute;
  top: 0;
  width: 100%;
  padding-top: 70px;
  z-index: 10;
}

.small-header__logo {
  svg {
    width: 121px;
    height: 38px;
  }
}
</style>
