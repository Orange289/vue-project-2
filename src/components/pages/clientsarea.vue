<template>
  <main class="clientsarea">
    <topHeader />
    <InsideTemplate v-if="isAuthorized" :sections="sections">
      <template v-slot:content>
        <ca-orders v-if="isOrdersPage" />
        <payment v-else-if="isPaymentPage" />
        <new-order v-else-if="isNewOrderPage" />
      </template>
    </InsideTemplate>
    <div class="login-message" v-else>You need to login for access to your clientsarea</div>
    <Footer />
  </main>
</template>

<script>
import InsideTemplate from './../sections/ca-crm/InsideTemplate.vue';
import caOrders from './../sections/ca-crm/caOrders.vue';
import newOrder from './../sections/ca-crm/newOrder.vue';
import Payment from './../sections/ca-crm/Payment.vue';

export default {
  metaInfo: {
    title: 'SixNines | Clientsarea'
  },
  components: {
    InsideTemplate,
    caOrders,
    Payment,
    newOrder
  },
  data() {
    return {
      sections: [
        {
          name: 'My orders',
          id: 'my-orders',
          icon: 'orders',
          action: this.onOrdersClick,
          isActive: true
        },
        {
          name: 'FAQ & Knowledge base',
          id: 'faq',
          icon: 'faq',
          url: '#',
        }
      ]
    }
  },
  computed: {
    isAuthorized () {
      return this.$store.state.user.isAuthorized;
    },
    isOrdersPage () {
      return this.$store.state.clientsarea.isOrdersPage;
    },
    isPaymentPage () {
      return this.$store.state.clientsarea.isPaymentPage;
    },
    isNewOrderPage () {
      return this.$store.state.clientsarea.isNewOrderPage;
    }
  },
  mounted() {
    if (this.isNewOrderPage) {
      document.body.classList.add('neworder');
    } else {
      document.body.classList.remove('neworder');
    }
  },
  methods: {
    onOrdersClick() {

    },
  }
}
</script>

<style lang="scss">
.clientsarea {
  overflow-x: hidden;

  .top-header__user {
    order: 0;
  }
}
</style>
