<template>
  <main class="signin">
    <Login v-show="isLogin" />
    <Register v-show="isReg" />
    <Forgot v-show="isForgot" />
  </main>
</template>

<script>
import Login from './../sections/signin/Login.vue';
import Register from './../sections/signin/Register.vue';
import Forgot from './../sections/signin/ForgotPassword.vue';

export default {
  metaInfo: {
    title: 'SixNines | Signin'
  },
  components: {
    Login,
    Register,
    Forgot
  },
  computed: {
    isLogin () {
      return this.$store.state.user.isLogin;
    },
    isReg () {
      return this.$store.state.user.isReg;
    },
    isForgot () {
      return this.$store.state.user.isForgot;
    }
  },
  mounted() {
      if(this.$route.query.restore !== undefined)
          this.$store.commit('setForgot');
  }

}
</script>

<style lang="scss">
.signin {
  .breadcrumbs {
    margin-bottom: 79px;
  }

  @include bp(desktop--big) {
    h2 {
      font-size: 50px;
    }
  }
}
</style>
