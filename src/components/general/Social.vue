<template>
  <ul class="social">
    <li v-for="(item, index) in items"
      :key="index"
      :class="['social__icon', `social__icon--${item.name}`]">
      <a :href="item.url">
        <svg><use :xlink:href="`#sprite-${item.name}`"></use></svg>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Social',
  data() {
    return {
      items: [
        {
          name: 'social-google',
          url: '#'
        },
        {
          name: 'social-facebook',
          url: '#'
        },
        {
          name: 'social-vk',
          url: '#'
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.social {
  display: flex;
  margin-bottom: 38px;
}

.social__icon {
  margin-right: 15px;

  a:hover {
    opacity: .9;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  &--social-vk svg {
    width: 35px;
  }
}
</style>
