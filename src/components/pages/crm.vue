<template>
  <main class="crm">
    <topHeader />
    <InsideTemplate v-if="isAuthorized" :sections="sections">
      <template v-slot:content>
        <crm-orders v-if="!isOrderEditPage" />
        <crm-order-edit v-else/>
        <!-- :class="{'visible' : isOrderEditPage}" /> -->
      </template>
    </InsideTemplate>
    <div class="login-message" v-else>You need to login for access to your clientsarea</div>
    <Footer />
  </main>
</template>

<script>
import InsideTemplate from './../sections/ca-crm/InsideTemplate.vue';
import crmOrders from './../sections/ca-crm/crmOrders.vue';
import crmOrderEdit from './../sections/ca-crm/crmOrderEdit.vue';

export default {
  metaInfo: {
    title: 'SixNines | Crm'
  },
  components: {
    InsideTemplate,
    crmOrders,
    crmOrderEdit,
  },
  computed: {
    isAuthorized () {
      return this.$store.state.user.isAuthorized;
    },
    isOrderEditPage () {
      return this.$store.state.crm.isOrderEditPage;
    }
  },
  data() {
    return {
      sections: [
        {
          name: 'Orders list',
          id: 'orders-list',
          icon: 'orders',
          action: this.onOrdersClick,
          isActive: true
        }
      ]
    }
  },
  mounted() {
    this.$store.commit('resetOrderEditPage');
  },
  methods: {
    onOrdersClick() {
      if (this.isOrderEditPage) {
        this.$store.commit('resetOrderEditPage');
        this.$nextTick(function() {
          document.querySelector('.inside__section--orders-list').classList.add('active');
        })

        if(this.orderNotFound) {
          this.$store.commit('resetOrderNotFound');
        }
      }
    },
  }
}
</script>

<style lang="scss">
.crm {
  .top-header__user {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
