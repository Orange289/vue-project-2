<template>
  <div class="reg-template">
    <slot></slot>
    <div :class="['reg-template__left', {'is-login': isLogin}, {'is-reg': isReg}]">
      <container>
        <slot name="breadcrumbs"></slot>
        <h2><slot name="leftTitle"></slot></h2>
        <social />
        <slot name="authForm"></slot>
      </container>
    </div>
    <div :class="['reg-template__right', {'is-login': isLogin}, {'is-reg': isReg}]">
      <h2><slot name="rightTitle"></slot></h2>
      <p><slot name="desc"></slot></p>
      <slot name="rightBtn"></slot>
    </div>
  </div>
</template>

<script>
import social from './Social.vue';

export default {
  name: 'RegTemplate',
  components: {
    social
  },
  computed: {
    isLogin () {
      return this.$store.state.user.isLogin;
    },

    isReg () {
      return this.$store.state.user.isReg;
    }
  },

}
</script>

<style lang="scss" scoped>
.reg-template {
  color: #fff;
}

.reg-template__left {
  padding-top: 200px;
  position: relative;
  height: 100vh;

  &.is-login {
    background-image: url('/assets/images/bg-signin.jpg');
  }

  &.is-login:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($violet-color, .95);
  }

  &.is-reg {
    left: 0;
    top: 0;
    @include prlgrm(170deg, $gray-dark-color);
    position: absolute;
    width: 55%;
    z-index: 1;

    @include bp(1340px) {
      .container {
        margin: 0;
        padding-right: 0;
        padding-left: 7%;
      }
    }

    @include bp(1490px) {
      .container {
        padding-left: 10%;
      }
    }

    @include bp(1540px) {
      .container {
        padding-left: 12%;
      }
    }

    @include bp(1600px) {
      .container {
        padding-left: 16%;
      }
    }

    @include bp(1700px) {
      .container {
        padding-left: 20%;
      }
    }

    @include bp(1800px) {
      .container {
        padding-left: 24%;
      }
    }

    @include bp(1900px) {
      .container {
        padding-left: 27%;
      }
    }
  }

  &.is-reg:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 50%;
    height: 100%;
    z-index: -1;
    background: $gray-dark-color;
  }
}

.reg-template__right {
  width: 45%;
  height: 100vh;
  padding-top: 300px;
  padding-left: 90px;
  padding-right: 90px;

  h2 {
    margin-bottom: 87px;
    z-index: 1;
    position: relative;
  }

  p {
    margin-bottom: 93px;
    z-index: 1;
    position: relative;
  }

  &.is-login {
    @include prlgrm(170deg, $gray-dark-color);
    position: absolute;
    z-index: 2;

    right: 0;
    top: 0;
  }

  &.is-login:after {
    background: $gray-dark-color;
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 50%;
    height: 100%;
    z-index: -1;
  }

  &.is-reg {
    width: 100%;
    padding-left: 60%;
    z-index: 2;
    background-image: url('/assets/images/bg-signin.jpg');
  }

  &.is-reg:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba($violet-color, .95);
  }

  &.is-login:before {
    right: 100px;
  }

  @include bp(desktop--big) {
    padding-left: 175px;
    padding-right: 175px;

    p {
      font-size: 23px;
    }
  }
}
</style>
