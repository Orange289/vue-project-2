<template>
  <div class="inside">
    <container>
      <div class="inside__sidebar">
        <div class="inside__sections">
          <logo />
          <div :class="[`inside__section inside__section--${item.id}`, {'active': item.isActive}]" v-for="(item, index) in sections" :key="index">
            <a v-if="item.url" :href="item.url">
              <svg class="inside__section-icon"><use :xlink:href="`#sprite-${item.icon}`"></use></svg>
              {{ item.name }}
            </a>
            <a v-else-if="item.action" @click="item.action">
              <svg class="inside__section-icon"><use :xlink:href="`#sprite-${item.icon}`"></use></svg>
              {{ item.name }}
            </a>
          </div>
        </div>
      </div>
      <div :class="['inside__content', {'inside__content--crm-order': isOrderEditPage && !isClientsarea}]">
        <slot name="content"></slot>
      </div>
    </container>
  </div>
</template>

<script>

export default {
  name: 'InsideTemplate',
  props: {
    sections: {
      type: Array
    }
  },
  computed: {
    isOrderEditPage () {
      return this.$store.state.crm.isOrderEditPage;
    },
    isClientsarea () {
      return (this.$route.path.indexOf('clientsarea') > 0);
    }
  },
}
</script>

<style lang="scss">
.inside {
  background: $gray-lighter-color;
  overflow: hidden;

  .neworder & {
    background: #fff;
  }

  .container {
    display: flex;
  }

  .breadcrumbs {
    a {
      cursor: pointer;
    }

    a.active {
      cursor: default;
      color: rgba($gray-dark-color, .2);
    }
  }

  .logo {
    display: block;
    margin-bottom: 70px;
  }
}

.inside__sidebar {
  background: $gray-dark-color;
  width: 20%;
  max-width: 425px;
  position: relative;
  padding-top: 30px;
  padding-right: 50px;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    right: 50%;
    top: 0;
    width: 10000px;
    height: 100%;
    background: $gray-dark-color;
    z-index: 0;
  }
}

.inside__sections {
  position: relative;
  z-index: 1;
}

.inside__section {
  margin-bottom: 25px;

  a {
    font-size: 15px;
    text-transform: uppercase;
    cursor: pointer;

    svg {
      width: 10px;
      height: 10px;
    }

    &:hover {
      opacity: .9;
      text-decoration: none;
    }
  }

  &.active a {
    color: #fff;
    font-weight: 600;
    cursor: default;

    &:hover {
      opacity: 1;
    }
  }
}

.inside__content {
  width: 80%;
  padding-left: 45px;
  padding-top: 27px;
  position: relative;

  &:not(.inside__content--crm-order) {
    min-height: 700px;
  }
  // &--crm-order {
  //   height: 700px;
  // }
}

.inside__section-icon {
  margin-right: 17px;
}
</style>
