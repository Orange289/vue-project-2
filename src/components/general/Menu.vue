<template>
  <div class="menu" ref="menu">
    <div
      class="menu__close">
      <!-- @click="closeMenu()"> -->
      <div></div>
      <div></div>
    </div>
    <breadcrumbs class="menu__breadcrumbs" />
    <ul class="menu__links">
      <li v-for="(item, index) in items"
        :key="index">
        <a
          :href="item.url"
          :class="['menu__link', {'menu__link--render' : item.isBtn}]"
          @click="goToAnchor($event)">
          {{item.name}}
        </a>
      </li>
    </ul>
    <ul class="menu__contacts">
      <li class="menu__contact menu__contact--fb">
        <a href="#">
          <svg>
            <use xlink:href="#sprite-facebook"></use>
          </svg>
          FACEBOOK
        </a>
      </li>
      <li class="menu__contact">
        <a href="tel:+46768479177">+46 76-847 91 77</a>
      </li>
      <li class="menu__contact">
        <a href="maito:info@sixnines.se">info@sixnines.se</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    items: {
      type: Array,
      default: function() {
        return [
          {
            name: 'START RENDER',
            url: '#prices',
            isBtn: true
          },
          {
            name: 'SOFTWARE',
            url: '#software'
          },
          {
            name: 'PRICES',
            url: '#prices'
          },
          {
            name: 'HOW TO START',
            url: '#start'
          },
          {
            name: 'DOCUMENTS',
            url: '#documents'
          },]
      }
    },
  },
  methods: {
    closeMenu() {
      document.body.classList.remove('openedMenu');
      this.$refs.menu.classList.add('hidden');
    },
    goToAnchor($event) {
      let hashval = $event.target.getAttribute('href');
      $event.preventDefault();

      this.$nextTick(function() {
        let target = document.querySelector(hashval);
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        history.pushState(null, null, hashval);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
}

.menu__links {
  font-size: 15px;

  li + li {
    margin-top: 22px;
  }

  display: flex;

  li:first-child {
    order: 1;
  }

  li + li {
    margin-top: 0;
  }
}

.menu__link {
  color: #fff;
  font-weight: 400;
  margin-left: 55px;
  display: block;

  &--render {
    color: $violet-color;
    font-weight: 600;
    display: block;
    height: 60px;
    margin-top: -20px;
    margin-bottom: -20px;
    padding: 20px 52px;
    margin-left: 62px;
    background: $blue-color;
  }

  &--render:hover {
    text-decoration: none;
    opacity: .9;
  }

  @include bp(tablet desktop) {
    margin-left: 35px;
  }

  @include bp(desktop) {
    margin-left: 110px;
  }
}

.menu__breadcrumbs {
  display: block;
  font-family: $font-secondary;
  letter-spacing: 1.28px;

  a.active {
    color: rgba(#fff, .6);
    cursor: default;

    span {
      margin-right: 14px;
    }

    &:hover {
      text-decoration: none;
    }
  }
}

.menu__close {
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 26px;
  right: 62px;

  div {
    width: 24px;
    height: 2px;
    background: #fff;
    position: absolute;
  }

  div:first-child {
    transform: rotate(45deg);
  }

  div:last-child {
    transform: rotate(135deg);
  }

  // @include bp(tablet) {
    display: none;
  // }
}

.menu__contacts {
  font-family: $font-secondary;
  margin-top: 39px;

  // @include bp(tablet) {
    display: none;
  // }
}

.menu__contact {
  margin-bottom: 25px;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &--fb {
    font-family: $font-primary;
    font-weight: 600;
  }

  svg {
    width: 25px;
    height: 25px;
    margin-right: 15px;
  }
}
</style>
