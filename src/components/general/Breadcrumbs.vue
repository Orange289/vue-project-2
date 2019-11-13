<template>
  <div class="breadcrumbs">
    <a v-for="(item, index) in items" :key="index"
      :class="{'active': item.isActive}"
      :id="`bc-${item.id}`">
      {{item.name}}
      <!-- :href="item.url" -->
    </a>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  props: {
    items: {
      type: Array,
      default: function() {
        return [
          {
            id: 'home',
            name: 'home',
            url: '/',
          },
          {
            id: 'farm',
            name: 'render farm',
            url: '',
            isActive: true
          }
        ]
      }
    },
  }
}
</script>

<style lang="scss">
.breadcrumbs {
  font-family: $font-secondary;
  letter-spacing: 1.28px;

  cursor: default;

  a:hover {
    // opacity: .8;
    text-decoration: none;
  }

  a.active {
    color: rgba(#fff, .6);
    cursor: default;

    &:hover {
      opacity: 1;
    }

    span {
      margin-right: 14px;
    }
  }

  a + a {
    position: relative;

    &:before {
      content: '/';
    }
  }
}
</style>
