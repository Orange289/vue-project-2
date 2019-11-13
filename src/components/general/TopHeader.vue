<template>
  <div class="top-header">
    <container>
      <div v-if="$store.state.user.isAuthorized && !isCA" class="top-header__user">
        Welcome {{ $store.state.user.email }} <a v-if="!isCRM" href="/clientsarea">Go to clientsarea</a><a href="#" @click.prevent="logout">Logout</a>
      </div>
      <div v-else-if="$store.state.user.isAuthorized && isCA" class="top-header__user">
        {{ $store.state.user.email }}
      </div>
      <a href="/signin/" v-else>Login</a>
      <ul class="top-header__contacts" v-if="!isCRM">
        <li class="top-header__contact">
          Call us
          <a href="tel:+46768479177">+46 76-847 91 77</a>
        </li>
        <li class="top-header__contact">
          Email
          <a href="maito:info@sixnines.se">info@sixnines.se</a>
        </li>
      </ul>
    </container>
  </div>
</template>

<script>
export default {
  name: 'TopHeader',
  computed: {
    isCA () {
      return this.$route.name === 'Clientsarea';
    },
    isCRM () {
      return this.$route.name === 'Crm';
    }
  },
  methods: {
    logout() {
      this.$store.commit('setAuthentication', {
        isAuthorized: false,
        authToken: '',
        userId: 0,
        email: '',
      });
      this.$store.commit('resetOrderCreation');
    }
  },
}
</script>

<style lang="scss">
.top-header {
  color: #fff;
  font-size: $font-size-base - 2px;
  letter-spacing: 1.12px;
  padding: 10px 0;
  background: $gray-dark-color;
  position: relative;
  z-index: 2;

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.top-header__contacts {
  font-family: $font-secondary;
  display: flex;
}

.top-header__contact {
  & + & {
    margin-left: 80px;
  }
}

.top-header__user {
  order: 1;

  a {
    margin-left: 80px;
  }
}
</style>
