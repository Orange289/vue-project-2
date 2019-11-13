<template>
  <div class="forgot">
    <smallHeader />
    <container>
      <breadcrumbs :items="breadcrumbs" />
      <ResetPassword v-if="showReset" />
      <GetRestoreLink v-else />
    </container>
  </div>
</template>

<script>
import smallHeader from './../../general/SmallHeader.vue';
import ResetPassword from './ResetPassword';
import GetRestoreLink from './GetRestoreLink';

export default {
  name: 'Forgot',
  components: {
    smallHeader,
    ResetPassword,
    GetRestoreLink,
  },
  data() {
    return {
      breadcrumbs: [
        {
          id: 'home',
          name: 'home',
          url: ''
        },
        {
          id: 'farm',
          name: 'render farm',
          url: ''
        },
        {
          id: 'login',
          name: 'login',
          url: '',
        },
        {
          id: 'password',
          name: 'password recovery',
          url: '',
          isActive: true
        },
      ],
      showReset: false,
    }
  },
  mounted() {
      this.showReset = this.$route.query.restore !== undefined;
  },
}
</script>

<style lang="scss">
.forgot {
  color: #fff;
  padding-top: 200px;
  background: $violet-color;
  height: 100vh;

  h2 {
    margin-bottom: 63px;
  }

  p {
    font-size: 23px;
    max-width: 568px;
  }

  .field--email {
    width: 570px;
  }

  .field--password {
    width: 570px;
  }

  .form__submit {
    margin-top: 34px;
    margin-right: 22px;
    display: inline-block;
  }
}

.forgot__main {
  max-width: 650px;

  p {
    margin-bottom: 47px;
  }
}

.forgot__reset {
  p {
    margin-bottom: 85px;
  }

  .sixnines-btn {
    max-width: 210px;
  }
}
</style>
