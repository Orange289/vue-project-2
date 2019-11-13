<template>
  <main class="clientsarea clientsarea--payment">
    <topHeader />
    <InsideTemplate v-if="isAuthorized" :sections="sections">
      <template v-slot:content>
        <paymentResult />
      </template>
    </InsideTemplate>
    <div class="clientsarea__login-message" v-else>You need to login for access to your clientsarea</div>
    <Footer />
  </main>
</template>

<script>
import InsideTemplate from './../sections/ca-crm/InsideTemplate.vue';
import paymentResult from './../sections/ca-crm/PaymentResult.vue';

export default {
  metaInfo: {
    title: 'SixNines | Payment result'
  },
  components: {
    InsideTemplate,
    paymentResult
  },
  data() {
    return {
      sections: [
        {
          name: 'My orders',
          icon: 'orders',
          action: this.onOrdersClick,
          isActive: true
        },
        // {
        //   name: 'PAYMENT HISTORY',
        //   icon: 'wallet',
        //   action: this.onPaymentsClick,
        // },
        {
          name: 'FAQ & Knowledge base',
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
  },
  methods: {
    onOrdersClick() {

    },
    onPaymentsClick() {

    }
  }
}
</script>
