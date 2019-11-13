<template>
  <a class="logo" :href="isMultiservice ? 'https://sixnines.se/' : '/'">
    <svg>
      <use xlink:href="#sprite-logo"></use>
    </svg>
  </a>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    isMultiservice: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.logo {
  svg {
    width: 121px;
    height: 38px;
  }
}
</style>
