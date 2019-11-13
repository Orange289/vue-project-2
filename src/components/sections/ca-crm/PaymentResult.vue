<template>
  <div class="payment payment--result">
    <breadcrumbs :items="breadcrumbs" />
    <div class="payment__data">
      <div class="payment__order">order №{{ orderId }}</div>
      <div class="payment__result" v-if="paymentStatus === 'PENDING'">
        <h2>Payment processing...</h2>
        <p>Your payment is processing now, please wait a bit.<br>We'll finish shortly.</p>
      </div>
      <div class="payment__result" v-else-if="paymentStatus === 'SUCCESS'">
        <h2>You payment was successfully completed!</h2>
        <p>Thank you for your payment! <br>We will send you FTP credentials shortly!</p>
        <btn class="payment__btn" :btnAction="openOrders">My orders</btn>
      </div>
      <div class="payment__result" v-else>
        <h2>You payment was canceled!</h2>
        <p>An error occurred during the payment process.
        <p>{{ errorDescription }}</p>
        <p>Would you like to repeat the payment?</p>
        <btn class="payment__btn" v-if="repeatPossible" :btnAction="openPayment">Make a payment</btn>
        <btn class="payment__btn" :btnAction="openOrders">My orders</btn>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../libs/axios';

export default {
  name: 'PaymentResult',
  data() {
    return {
      breadcrumbs: [
        {
          id: 'orders',
          name: 'my orders',
          url: '#',
        },
        {
          id: 'payment-result',
          name: 'payment result',
          url: '',
          isActive: true
        }
      ],
      paymentStatus: 'PENDING',
      errorDescription: '',
      repeatPossible: true,
    }
  },
  mounted() {
    let _self = this;
    if (this.$route.query.token !== undefined) {
      axios.get('api/invoice/' + this.$route.query.token + "/token/")
          .then(invoice => {
              if(invoice.status === 200)
                axios.get('payment/paypal/' + invoice.data.id + '/authorize/')
                    .then(result => {
                  if (result.status === 200)
                      this.paymentStatus = "SUCCESS";
                  else {
                      this.paymentStatus = "ERROR";
                  }
                })
                    .catch(error => {
                      _self.paymentStatus = "ERROR";
                      _self.repeatPossible = false;
                      switch (error.response.status) {
                          case 417:
                              _self.errorDescription = 'Something went wrong during payment authorization';
                              _self.repeatPossible = true;
                              break;
                          case 422:
                              _self.errorDescription = 'It seems that you didnt authorize the payment or the payment already done';
                              _self.repeatPossible = true;
                              break;
                          case 404:
                              _self.errorDescription = 'Order not found';
                              break;
                          case 409:
                              _self.errorDescription = 'Sorry, but your ordered time is already taken. Please make a new order';
                              break;
                          case 400:
                              _self.errorDescription = 'Invalid payment token';
                              break;
                      }
                    });
              else {
                  _self.errorDescription = "Can't obtain invoice information. Please contact to customer support";
                  _self.paymentStatus = 'ERROR';
                  _self.repeatPossible = false;
              }
          });
    } else {
        this.paymentStatus = "ERROR";
        this.errorDescription = 'Invalid query parameters, please dont try to reach this page manually';
        this.repeatPossible = false;
    }

    this.$nextTick(function() {
      document.querySelector('#bc-orders').addEventListener('click', this.onOrdersClick);
    })
  },
  beforeDestroy() {
    this.$nextTick(function() {
      if (document.querySelector('#bc-orders')) {
        document.querySelector('#bc-orders').removeEventListener('click', this.onOrdersClick);
      }
    })
  },
  computed: {
    orderId() {
      return this.$store.state.clientsarea.orderId;
    }
  },
  methods: {
    onOrdersClick(e) {
      e.preventDefault();
      this.$router.push('/clientsarea');
      this.$store.commit('setOrdersPage');
    },
    openOrders() {
      this.$router.push('/clientsarea/');
      this.$store.commit('setOrdersPage');
    },
    openPayment() {
      this.$router.push('/clientsarea/');
      this.$store.commit('setPaymentPage');
    }
  },
}
</script>

<style lang="scss">
.payment {
  padding-bottom: 90px;

  .breadcrumbs {
    margin-bottom: 74px;

    a.active {
      color: rgba($gray-dark-color, .2);
    }
  }
}

.payment__order {
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 35px;
}

.payment__result {
  p {
    font-size: 22px;
    margin-bottom: 45px;
  }
}

.payment__btn {
  min-width: 180px;
  max-width: 240px;
  background: $blue-color;
  display: inline-block;

  &:hover:before {
    border-top-color: #fff;
  }
}
</style>
