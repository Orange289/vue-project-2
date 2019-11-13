<template>
  <section class="intro">
    <container>
      <div class="intro__desc">
        <h1>Cloud GPU&nbsp;render solutions</h1>
        <ul class="intro__list">
          <li>for individual artists</li>
          <li>for studios</li>
        </ul>
      </div>
      <div class="intro__logos">
        <div class="intro__soft intro__soft--notablet">
          <svg class="intro__soft-icon intro__soft-icon--octane"><use xlink:href="#sprite-octane"></use></svg>
          <svg class="intro__soft-icon intro__soft-icon--redshift"><use xlink:href="#sprite-redshift"></use></svg>
        </div>
        <div class="intro__soft intro__soft--tablet">
          <svg class="intro__soft-icon intro__soft-icon--octane"><use xlink:href="#sprite-octane-tablet"></use></svg>
          <svg class="intro__soft-icon intro__soft-icon--redshift"><use xlink:href="#sprite-redshift-tablet"></use></svg>
        </div>
        <div class="intro__features">
          <div class="intro__feature">
            <svg><use xlink:href="#sprite-hourly"></use></svg>
            Hourly<br>rent
          </div>
          <div class="intro__feature">
            <svg><use xlink:href="#sprite-daily"></use></svg>
            Daily<br>rent
          </div>
          <div class="intro__feature">
            <svg><use xlink:href="#sprite-long-time"></use></svg>
            Long-time<br>rent
          </div>
          <div class="intro__feature">
            <svg><use xlink:href="#sprite-support"></use></svg>
            24/7<br>Support
          </div>
        </div>
      </div>
    </container>
    <!-- <div class="intro__mob-menu">
      <div :class="['intro__mob-menu-top', {'sticky': isMenuSticky} ]">
        <a href="#">START RENDER</a>
        <Burger v-show="isMenuSticky" :menuArea="'intro'"/>
      </div>
      <Menu class="intro__menu"/>
    </div> -->
  </section>
</template>

<script>
import Menu from './../../general/Menu.vue';
import Burger from './../../general/Burger.vue';

export default {
  name: 'Intro',
  components: {
    Menu,
    Burger
  },
  data() {
    return {
      isMenuSticky: false,
      stickyClass: 'sticky'
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onWindowScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  },
  methods: {
    onWindowScroll() {
      const introMenuTop = document.documentElement.clientHeight - 44;

      if (window.pageYOffset > introMenuTop) {
        this.isMenuSticky = true;
      } else {
        this.isMenuSticky = false;
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.intro {
  color: #fff;
  padding-top: 100px;
  background: url('/assets/images/bg-intro.jpg');
  position: relative;

  h1 {
    font-size: 30px;
    font-weight: bold;
    font-style: italic;
    margin-bottom: 13px;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($gray-dark-color, .9);
  }

  // @include bp(0 tablet) {
  //   height: 100vh;
  //   display: flex;
  //   flex-direction: column;
  // }

  // @include bp(tablet) {
    padding-top: 300px;
    padding-bottom: 65px;

    .container {
      display: flex;
    }

    h1 {
      font-size: 60px;
      line-height: 1.07;
      margin-bottom: 53px;
    }
  // }

  @include bp(desktop) {
    padding-top: 340px;
    padding-bottom: 104px;

    h1 {
      font-size: 72px;
      line-height: 1.22;
      margin-bottom: 32px;
    }
  }
}

.intro__list {
  font-size: 20px;
  font-weight: bold;

  li {
    position: relative;
    padding-left: 21px;

    &:before {
      content: '';
      position: absolute;
      top: 10px;
      left: 0;
      width: 7.5px;
      height: 7.5px;
      background: $violet-color;
    }
  }

  // @include bp(tablet) {
    font-size: 30px;
    line-height: 1.9;

    li {
      padding-left: 57px;

      &:before {
        top: 23px;
        width: 15px;
        height: 15px;
      }
    }
  // }

  @include bp(desktop) {
    font-size: 38px;

    li {
      padding-left: 44px;

      &:before {
        top: 33px;
        width: 10px;
        height: 10px;
      }
    }
  }
}

.intro__desc {
  margin-bottom: 20px;

  // @include bp(tablet) {
    margin-right: 90px;
    flex: 0.8;
  // }

  @include bp(desktop) {
    flex: 0.6;
  }
}

.intro__logos {
  padding-bottom: 28px;

  // @include bp(tablet) {
    flex: 1;
    padding-bottom: 0;
    margin-top: 26px;
  // }
}

.intro__soft {
  display: flex;
  justify-content: space-between;
}

.intro__soft--notablet {
  margin-bottom: 25px;

  svg {
    width: 120px;
    height: 30px;
  }

  @include bp(tablet desktop) {
    display: none;
  }

  @include bp(desktop) {
    margin-bottom: 126px;

    .intro__soft-icon--octane {
      width: 360px;
      height: 89px;
    }

    .intro__soft-icon--redshift {
      width: 310px;
      height: 75px;
    }
  }
}

.intro__soft--tablet {
  display: none;
  align-items: flex-end;
  margin-bottom: 70px;

  .intro__soft-icon--octane {
    width: 140px;
    height: 140px;
  }

  .intro__soft-icon--redshift {
    width: 195px;
    height: 100px;
  }

  @include bp(tablet desktop) {
    display: flex;
  }
}

.intro__features {
  display: flex;
  justify-content: space-between;

  svg {
    display: block;
    // width: 36px;
    // height: 36px;
    margin: 0 auto 10px;
  }

  // @include bp(tablet) {
    svg {
      width: 60px;
      height: 60px;
    }
  // }

  @include bp(desktop) {
    svg {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
    }
  }
}

.intro__feature {
  // font-size: 10px;
  text-transform: uppercase;
  font-weight: 600;
  text-align: center;
  line-height: 1.45;

  // @include bp(tablet) {
    font-size: 15px;
  // }

  @include bp(desktop) {
    font-size: 23px;
  }
}

.intro__mob-menu {
  position: relative;
  z-index: 1;

  // @include bp(tablet) {
    display: none;
  // }
}

.intro__mob-menu-top {
  font-weight: 600;
  text-align: center;
  position: relative;
  padding: 11px;
  background: $violet-color;

  &.sticky {
    position: fixed;
    width: 100%;
    top: 0;
  }

  .openedMenu &.sticky {
    display: none;
  }

  .burger {
    position: absolute;
    right: 30px;
    top: 12px;
  }
}

</style>
