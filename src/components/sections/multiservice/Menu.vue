<template>
  <div class="m-menu hidden" ref="menu">
    <div
      class="m-menu__close"
      @click="closeMenu()">
      <div></div>
      <div></div>
    </div>
    <logo isMultiservice />
    <ul class="m-menu__links">
      <li v-for="(item, index) in items"
        :key="index">
        <a
          :href="item.url"
          :class="['m-menu__link', {'m-menu__link--render' : item.isBtn}]">
          {{item.name}}
        </a>
      </li>
    </ul>
    <ul class="m-menu__contacts">
      <li class="m-menu__contact m-menu__contact--fb">
        <a href="https://www.facebook.com/Six-Nines-800782973599301/?epa=SEARCH_BOX">
          <svg>
            <use xlink:href="#sprite-social-facebook"></use>
          </svg>
          FACEBOOK
        </a>
      </li>
      <li class="m-menu__contact">
        <a href="tel:+46768479177">+46 76-847 91 77</a>
      </li>
      <li class="m-menu__contact">
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
            name: 'Home',
            url: 'https://sixnines.se/',
            isBtn: true
          },
          {
            name: 'DEEP LEARNING',
            url: 'https://sixnines.se/deeplearning/'
          },
          {
            name: 'MULTISERVICE RENT',
            url: 'https://render.sixnines.se/multiservice-rent/'
          },
          {
            name: 'CONTACTS',
            url: 'https://sixnines.se/#contacts'
          },
          {
            name: 'Make a request',
            url: 'https://sixnines.se/deeplearning/#makearequestblock'
          }
        ]
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

      setTimeout(function() {
        let target = document.querySelector(hashval);
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        history.pushState(null, null, hashval);
      }, 1);
    }
  }
}
</script>

<style lang="scss" scoped>
.m-menu {
  .logo {
    display: none;
  }

  @include bp(0 tablet) {
    font-size: 32px;
    text-align: center;
    margin-left: -30px;
    margin-right: -30px;
    background: $gray-dark-color;

    .openedMenu & {
      z-index: 10000;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding-top: 100px;
      padding-left: 0;
      padding-right: 0;
      min-height: 100vh;
      position: absolute;
      overflow-y: scroll;
    }
  }

  @include bp(tablet) {
    display: flex !important;
    align-items: center;
    justify-content: space-between;

    .logo {
      display: block;
    }
  }
}

.m-menu__links {
  font-size: 32px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  a {
    color: #fff;
    display: block;
    text-transform: uppercase;

    &:hover {
      color: $blue-color;
      text-decoration: none;
    }
  }

  li {
    width: 100%;
  }

  li + li {
    margin-top: 42px;
  }

  li:last-child {
    @include multi-btn();
  }

  @include bp(0 tablet) {
    width: 350px;
    margin: auto;
  }

  @include bp(tablet) {
    flex-wrap: nowrap;
    justify-content: space-between;
    font-size: 15px;
    width: 733px;

    a {
      display: inline-block;
    }

    .logo {
      display: block;
    }

    li {
      width: auto;
      // min-width: 75px;
    }

    li:last-child {
      order: 1;
    }

    li + li {
      margin-top: 0;
    }

    li a,
    li:last-child {
      font-weight: 400;
      // margin-left: 40px;
      margin-left: 0;
    }

    li:last-child a,
    li:first-child a {
      margin-left: 0;
    }

  }

  // @include bp(desktop) {
  //   a {
  //     margin-left: 110px;
  //   }
  // }
}

.m-menu__breadcrumbs {
  display: none;
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

  @include bp(tablet) {
    display: block;
  }
}

.m-menu__close {
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 64px;
  right: 80px;

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

  @include bp(tablet) {
    display: none;
  }
}

.m-menu__contacts {
  font-family: $font-secondary;
  margin-top: 80px;

  @include bp(tablet) {
    display: none;
  }
}

.m-menu__contact {
  font-size: 30px;
  font-family: $font-secondary;
  margin-bottom: 40px;

  a {
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      text-decoration: none;
    }
  }

  &--fb {
    font-size: 32px;
    font-family: $font-primary;
    font-weight: 600;
  }

  svg {
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }
}

</style>
