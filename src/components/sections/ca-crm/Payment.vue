<template>
  <div class="payment">
    <breadcrumbs :items="breadcrumbs" />
    <div class="payment__data">
      <div class="payment__order">order №{{ orderId }}</div>
      <div class="payment__amount">
        Total payment
        <span class="payment__price">€ {{ price }}</span>
      </div>
      <div class="payment__options">
        <div class="payment__option"
          v-for="(item, index) in payments"
          :key="index"
          >
          <div :class="[`payment__option-title payment__option-title--${item.name}`]">
            <svg><use :xlink:href="`#sprite-${item.name}`"></use></svg>
            {{ item.title }}
          </div>
          <btn :class="['payment__btn', {'loading' : loading(item)}]" :disabled="!item.enable" :btnAction="item.onClick">Pay now</btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../libs/axios';
export default {
  name: 'Payment',
  data() {
    return {
      breadcrumbs: [
        {
          id: 'orders',
          name: 'my orders',
          url: '#',
        },
        {
          id: 'payment',
          name: 'payment',
          url: '',
          isActive: true
        }
      ],
      payments: [
        {
          name: 'card',
          title: 'VISA/MASTERCARD',
          onClick: this.onCardClick,
          enable: false,
        },
        {
          name: 'paypal',
          title: 'paypal',
          onClick: this.onPaypalClick,
          enable: false,
        },
      ],
      invoice: 0,
      price: "Calculating...",
      paypalLoading: false,
      cardLoading: false
    }
  },
  computed: {
    orderId() {
      return this.$store.state.clientsarea.orderId;
    }
  },
  mounted() {
    let _self = this;

    setTimeout(function() {
      axios.post('/api/order/' + _self.orderId + '/invoice/', {})
        .then(result => {
            if (result.status === 201) {
                _self.invoice = result.data.invoice;
                _self.price = result.data.amount;
                _self.payments.forEach(item => item.enable = true);
            }
        })
        .catch(error => {
            if(error.result.status === 422)
                alert('You have already paid for this order');
            if(error.result.status === 406)
                alert('Order status does not require a payment');
        });
    }, 50);

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
  methods: {
    onOrdersClick(e) {
      e.preventDefault();
      this.$store.commit('setOrdersPage');
    },
    loading(el) {
      if (el.name === 'paypal') {
        return this.paypalLoading;
      } else {
        return this.cardLoading;
      }
    },
    onCardClick() {

    },
    onPaypalClick() {
      if (this.orderId === null)
          alert('Order ID missing');
      else {
        this.payments[1].enable = false; // Setting the button to disabled state
        this.paypalLoading = true;
        axios.get('payment/paypal/' + this.invoice + '/create/')
            .then(result => {
                this.paypalLoading = false;

                if (result.status === 201) {
                    window.location.href = result.data.link; // Redirecting the user to the payment system
                } else {
                    alert("Something went wrong");
                    this.payments[1].enable = true; // Releasing the button
                }
            })
            .catch(error => {
                if (error.response.status === 409) {
                    alert("Sorry, your order time is already taken. Please make a new order");
                } else
                  alert("Something went wrong " + error.response.data);
                this.payments[1].enable = true; // Releasing the button
            })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.payment {
  padding-bottom: 90px;

  .breadcrumbs {
    margin-bottom: 74px;
  }
}

.payment__order {
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 15px;
}

.payment__amount {
  font-size: 38px;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-bottom: 26px;
}

.payment__price {
  color: $pink-color;
  font-size: 40px;
  font-weight: 400;
  margin-left: 31px;
}

.payment__option {
  background: #fff;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  height: 65px;
}

.payment__option-title {
  color: $violet-color;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 22px 25px;
  position: relative;

  svg {
    height: 30px;
  }

  &--paypal {
    padding-top: 17px;
    padding-bottom: 17px;

    svg {
      width: 25px;
      margin-right: 30px;
    }
  }

  &--card {
    svg {
      width: 33px;
      height: 22px;
      margin-right: 24px;
    }
  }
}

.payment__btn {
  margin: 0;
  height: 65px;
  max-width: 170px;
  background-color: $blue-color;

  &:before {
    border-top: 65px solid #fff;
  }
}
</style>
