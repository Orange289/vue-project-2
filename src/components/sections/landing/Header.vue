<template>
  <div class="header">
    <topHeader />
    <div class="header__middle">
      <container>
        <logo />
        <ul class="header__links">
          <li v-for="(link, index) in links"
              :key="index">
              <a :href="link.url"
                :class="['header__link', `header__link--${link.label}`]">
                {{ link.name }}
              </a>
          </li>
        </ul>
      </container>
    </div>
    <div :class="['header__main', {'sticky': isMenuSticky}]">
      <container>
        <div class="header__controls">
          <a class="header__login" href="#">Login</a>
          <a class="header__logo" href="/">
            <svg >
              <use xlink:href="#sprite-logo"></use>
            </svg>
          </a>
          <Burger />
        </div>
        <Menu class="header__menu" />
      </container>
    </div>
  </div>
</template>

<script>
import Menu from './../../general/Menu.vue';
import Burger from './../../general/Burger.vue';

export default {
  name: 'mainHeader',
  components: {
    Menu,
    Burger
  },
  data() {
    return {
      links: [
        {
          label: 'about',
          name: 'ABOUT US',
          url: '#'
        },
        {
          label: 'render',
          name: 'RENDER FARM',
          url: '/'
        },
        {
          label: 'contacts',
          name: 'CONTACTS',
          url: '#'
        }
      ],
      isMenuSticky: false
    }
  },
  mounted() {
    let menuTop = 180;
    let _self = this;

    window.addEventListener('scroll', function() {
      if ((window.pageYOffset > menuTop) && (window.matchMedia('(min-width: 1024px)')).matches) {
        _self.isMenuSticky = true;
      } else {
        _self.isMenuSticky = false;
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  width: 100%;
  z-index: 11;
}

.header__middle {
  padding-top: 50px;
  padding-bottom: 50px;
  background: transparent;

  display: block;

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.header__links {
  display: flex;
}

.header__link {
  font-size: 15px;
  color: #fff;
  margin-left: 100px;

  &--render {
    font-weight: 600;
    position: relative;
  }

  &--render:after {
    content: 'beta';
    font-family: $font-secondary;
    font-size: 10px;
    letter-spacing: .8px;
    color: $blue-color;
    position: absolute;
    top: -6px;
    right: -30px;
  }
}

// .header__logo {
//   svg {
//     width: 121px;
//     height: 38px;
//   }
// }

.header__main {
  background: $violet-color;
  padding: 20px 0;

  &.sticky {
    position: fixed;
    top: 0;
    width: 100%;
  }
}

.header__controls {
    display: none;
}

// .header__welcome {
//   order: 1;

//   a {
//     margin-left: 80px;
//   }
// }
</style>
