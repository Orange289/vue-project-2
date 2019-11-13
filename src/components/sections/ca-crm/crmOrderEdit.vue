<template>
  <div class="crm-edit">
    <div class="crm-edit__back" @click="onBackClick"></div>
    <div class="orders-preloader" v-if="loading"><img src="/assets/images/preloader.gif"></div>
    <div class="crm-edit__content" v-if="!orderNotFound && !loading">
      <div class="crm-edit__info" >
        <div class="crm-edit__data">
          <h2 class="crm-edit__title">Order №{{ orderId }}</h2>
          <div :class="['crm-edit__status', `crm-edit__status--${status}`]">{{ formattedStatus }}</div>
          <div class="crm-edit__row"><b>Start time</b>{{ startTime }}</div>
          <div class="crm-edit__row"><b>Render</b>{{ render }}</div>
          <div class="crm-edit__row"><b>Program</b>{{ program }}</div>
          <div class="crm-edit__row"><b>Duration</b>{{ duration }}</div>
          <div class="crm-edit__row"><b>GPU Status</b>{{ gpuStatus }}</div>
        </div>
        <div class="crm-edit__prices">
          <div class="crm-edit__row"><b>Initial price</b>€{{ initialPrice }}</div>
          <div class="crm-edit__row"><b>Final price</b>€{{ finalPrice }}</div>
          <b>Invoices</b>
          <div class="crm-edit__invoices">
            <div class="crm-edit__invoices-titles">
              <span class="id">ID</span>
              <span class="time">Creation time</span>
              <span class="status">Status</span>
            </div>
            <div class="crm-edit__invoices-content" v-if="invoices.length > 0">
              <div class="crm-edit__invoice"
                v-for="(item, index) in invoices"
                :key="index">
                <span class="id">{{ item.id }}</span>
                <span class="time">{{ formatTime(item.created_at) }}</span>
                <span class="status">{{ formatStatus(item.status) }}</span>
                <a @click="getInvoiceInfo($event)"
                  :data-info="item.id"
                  class="crm-edit__icon crm-edit__icon--info"></a>
                <a @click="changeInvoiceStatus($event)"
                  :data-edit="item.id"
                  class="crm-edit__icon crm-edit__icon--edit"></a>
                <a @click="onPaymentClick($event)"
                  :data-payment="item.id"
                  class="crm-edit__icon crm-edit__icon--payment"></a>
              </div>
            </div>
            <div class="crm-edit__error crm-edit__error--invoices" v-else>
              Invoices not found
            </div>
          </div>
        </div>
      </div>
      <div class="crm-edit__controls">
        <h2 class="crm-edit__title">Remote controls</h2>
        <div v-if="accessError" class="crm-edit__error crm-edit__error--access">
          You can't send access for the orders with statuses "Waiting for payment" and "Reserved".
        </div>
        <form v-else :action="action"
          class="crm-edit__form"
          @submit.prevent="submit">
          <div class="crm-edit__tabs">
            <div :class="['crm-edit__tab', {'active': isFtp}]" @click="onTabClick">FTP</div>
            <div :class="['crm-edit__tab', {'active': !isFtp}]" @click="onTabClick">Team Viewer</div>
          </div>
          <div class="crm-edit__form-content" v-if="isFtp">
            <div class="crm-edit__inputs" v-if="!dataSent">
              <input
                :class="['field__input crm-edit__input', {'crm-edit__input--error': $v.ftpLogin.$error}]" type="text"
                placeholder="Login"
                v-model.trim="$v.ftpLogin.$model"
                v-multi-ref:crm-field/>
              <input
                :class="['field__input crm-edit__input', {'crm-edit__input--error': $v.ftpPassword.$error}]"  type="text"
                placeholder="Password"
                v-model.trim="$v.ftpPassword.$model"
                v-multi-ref:crm-field/>
            </div>
            <div class="crm-edit__data" v-else>
              <div class="crm-edit__data-item">
                <b>Login</b>{{ ftpLogin }}
              </div>
              <div class="crm-edit__data-item">
                <b>Password</b>{{ ftpPassword }}
              </div>
            </div>
          </div>
          <div class="crm-edit__form-content" v-if="!isFtp">
            <div class="crm-edit__inputs" v-if="!dataSent">
              <input
                :class="['field__input crm-edit__input', {'crm-edit__input--error': $v.tvLogin.$error}]" type="text"
                placeholder="Login"
                v-model.trim="$v.tvLogin.$model"
                v-multi-ref:crm-field/>
              <input
                :class="['field__input crm-edit__input', {'crm-edit__input--error': $v.tvPassword.$error}]"  type="text"
                placeholder="Password"
                v-model.trim="$v.tvPassword.$model"
                v-multi-ref:crm-field/>
            </div>
            <div class="crm-edit__data" v-else>
              <div class="crm-edit__data-item">
                <b>Login</b>{{ tvLogin }}
              </div>
              <div class="crm-edit__data-item">
                <b>Password</b>{{ tvPassword }}
              </div>
            </div>
          </div>
          <div class="crm-edit__submit" v-if="!dataSent">
            <button :class="['sixnines-btn crm-edit__btn', {'loading': submitStatus === 'PENDING'}]"
              type="submit">Send access</button>
            <a class="crm-edit__clear" @click="clearForm">Clear all</a>
            <div class="crm-edit__error crm-edit__error--form" v-if="submitStatus === 'ERROR'">Please fill all the fields!</div>
          </div>
          <button v-else class="sixnines-btn crm-edit__btn" @click="onChangeClick">Change data</button>
        </form>
      </div>
    </div>
    <div class="crm-edit__error" v-else-if="orderNotFound && !loading">
      Order not found
    </div>
    <modal v-if="showJsonModal"
      @close="showJsonModal = false"
      class="crm-edit__popup crm-edit__popup--json">
      <template v-slot:body>
        <vue-json-pretty
          :path="'res'"
          :data="popup">
        </vue-json-pretty>
      </template>
    </modal>
    <modal v-else-if="showResponseModal"
      @close="showResponseModal = false"
      class="crm-edit__popup">
      <template v-slot:body>
        {{ popup }}
      </template>
    </modal>
  </div>
</template>

<script>
import axios from './../../../libs/axios';
import { required } from 'vuelidate/lib/validators';
import { TimeHelpers } from './../../../libs/helpers/time';
import { CountHelpers } from './../../../libs/helpers/count';
import JSONFormatter from 'json-formatter-js';
import VueJsonPretty from 'vue-json-pretty';
import modal from './../../general/Modal';

export default {
  name: 'crmOrderEdit',
  components: {
    VueJsonPretty,
    modal
  },
  data() {
    return{
      isFtp: true,
      ftpLogin: '',
      ftpPassword: '',
      tvLogin: '',
      tvPassword: '',
      action: `api/crm/orders/${this.$store.state.crm.orderId}/access/`,
      submitStatus: 'OK',
      dataSent: false,
      popup: null,
      showJsonModal: false,
      showResponseModal: false,
    }
  },
  validations: {
    ftpLogin: {
      required
    },
    ftpPassword: {
      required
    },
    tvLogin: {
      required
    },
    tvPassword: {
      required
    }
  },
  computed: {
    loading() {
      return this.$store.state.crm.isLoading;
    },
    orderNotFound() {
      return this.$store.state.crm.orderNotFound;
    },
    orderId() {
      return this.$store.state.crm.orderId;
    },
    status() {
      return this.$store.state.crm.status;
    },
    formattedStatus() {
      return this.formatStatus(this.$store.state.crm.status);
    },
    gpuStatus() {
      return CountHelpers.formatGPUStatus(this.$store.state.crm.gpuStatus);
    },
    startTime() {
      return this.$store.state.crm.datetime;
    },
    render() {
      return this.$store.state.crm.render;
    },
    program() {
      return this.$store.state.crm.program;
    },
    server() {
      return this.$store.state.crm.server;
    },
    duration() {
      return this.$store.state.crm.duration;
    },
    initialPrice() {
      return this.$store.state.crm.initialPrice;
    },
    finalPrice() {
      return this.$store.state.crm.finalPrice;
    },
    dataExists() {
      return this.$store.state.crm.dataExists;
    },
    invoices() {
      return this.$store.state.crm.invoices;
    },
    accessError() {
      return this.$store.state.crm.accessError;
    }
  },
  mounted() {
    this.checkData();

    this.$nextTick(function() {
      document.addEventListener('keyup', this.onDocumentKeyUp);
    })
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.onDocumentKeyUp);
  },
  methods: {
    onDocumentKeyUp(e) {
      this.$nextTick(function() {
        if ((e.keyCode === 27) && (this.showJsonModal || this.showResponseModal)) {
          this.closePopup();
        }
      })
    },
    onBackClick() {
      this.$store.commit('resetOrderEditPage');
      this.$nextTick(function() {
        document.querySelector('.inside__section--orders-list').classList.add('active');

        if(this.orderNotFound) {
          this.$store.commit('resetOrderNotFound');
        }
      })
    },
    formatStatus(value) {
      switch(value) {
        case 'P': return 'Waiting for payment';
        case 'W': return 'Waiting for begin';
        case 'I': return 'In progress';
        case 'R': return 'Reserved';
        case 'N': return 'New';
        case 'A': return 'Approved';
        case 'F': return 'Paid';
        case 'C': return 'Canceled';
      }
    },
    formatTime(value) {
      return TimeHelpers.localizeDateTime(value).toFormat('dd/MM/yyyy H:mm:ss');
    },
    onTabClick() {
      this.isFtp = !this.isFtp;
    },
    submit() {
      this.$v.$touch();

      let _self = this;

      let ftpLogin = this.ftpLogin;
      let ftpPassword = this.ftpPassword;
      let tvLogin = this.tvLogin;
      let tvPassword = this.tvPassword;

      let data = {
        ftp_username: ftpLogin,
        ftp_password: ftpPassword,
        tv_username: tvLogin,
        tv_password: tvPassword
      };

      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR';
      } else {
        this.submitStatus = 'PENDING';

        if (!this.dataExists) {
          axios.post(this.action, data)
            .then(response => {
              if (response.status === 201) {
                _self.submitStatus = 'OK';
                _self.dataSent = true;
              }
            })
        } else {
          axios.put(this.action, data)
            .then(response => {
              if (response.status === 200) {
                _self.submitStatus = 'OK';
                _self.dataSent = true;
              }
            })
        }
      }
    },
    clearForm() {
      let fields = this.$refs['crm-field'];

      fields.forEach(el => {
        el.value = '';
        this.ftpLogin = '';
        this.ftpPassword = '';
        this.tvLogin = '';
        this.tvPassword = '';
      })
    },
    checkData() {
      axios.get(this.action)
        .then(response => {
          if (response.status === 200) {
            this.dataSent = true;
            this.ftpLogin = response.data.ftp_username;
            this.ftpPassword = response.data.ftp_password;
            this.tvLogin = response.data.tv_username;
            this.tvPassword = response.data.tv_password;
            this.$store.commit('setDataExists');
          }
        })
        .catch(error => {
          if (error.response.status === 404) {
            this.dataSent = false;
            this.$store.commit('resetDataExists');
          }
        })
    },
    onChangeClick() {
      this.dataSent = false;
    },
    getInvoiceInfo($event) {
      let invoiceId = $event.target.dataset.info;
      let _self = this;

      axios.get(`api/crm/invoice/${invoiceId}/`)
      .then(response => {
        _self.popup = response.data;
        _self.showJsonModal = true;
      })
      .catch(error => {
        _self.popup = error.response.data.error;
        _self.showResponseModal = true;
      })
    },
    changeInvoiceStatus($event) {
      let invoiceId = $event.target.dataset.edit;
      let message;
      let _self = this;

      axios.put(`api/crm/invoice/${invoiceId}/`)
      .then(response => {
        if (response.status === 200) {
          _self.showResponseModal = true;
          _self.popup = 'Status was successfully changed!';
        }
      })
      .catch(error => {
        _self.showResponseModal = true;
        _self.popup = error.response.data.error;
      })
    },
    closePopup() {
      if (this.showJsonModal) {
        this.showJsonModal = false;
      } else if (this.showResponseModal) {
        this.showResponseModal = false;
      }
    },
    onPaymentClick($event) {
      let _self = this;
      let invoiceId = $event.target.dataset.payment;

      axios.post(`api/crm/invoice/${invoiceId}/`)
        .then(response => {
          _self.showResponseModal = true;
          _self.popup = 'The payment was successfully completed!';
        })
        .catch(error => {
          _self.showResponseModal = true;
          _self.popup = error.response.data.error;
        })
    }
  },
}
</script>

<style lang="scss">
.crm-edit {
  // position: absolute;
  // top: 0;
  // left: 0;
  width: 100%;
  z-index: 1;
  // transform: translateX(10000px);
  // transition: transform .3s;
  background: $gray-lighter-color;
  // padding-left: 45px;
  // padding-top: 27px;

  // &.visible {
  //   transform: translateX(0);
  // }
}

.crm-edit__back {
  @include arrow(30px, 30px, $blue-color, true);
  margin-bottom: 36px;
  margin-left: 10px;
}

.crm-edit__title {
  color: $violet-color;
  font-size: 38px;

  .crm-edit__controls & {
    color: #fff;
    position: relative;
    z-index: 1;
  }
}

.crm-edit__content {
  display: flex;
}

.crm-edit__prices {
  color: #fff;
  background: $violet-color;
  margin-left: -45px;
  padding-top: 34px;
  padding-left: 45px;
}

.crm-edit__info {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.crm-edit__controls {
  width: 50%;
}

.crm-edit__status {
  font-size: 14px;
  font-weight: 600;
  position: relative;
  padding-left: 23px;
  margin-bottom: 30px;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    width: 8px;
    height: 8px;
    border-radius: 100%;
  }

  &--I {
    color: $green-color;
  }

  &--I:before {
    background: $green-color;
  }

  &--R {
    color: $yellow-color;
  }

  &--R:before {
    background-color: $yellow-color;
  }

  &--W {
    color: $violet-color;
  }

  &--W:before {
    background-color: $violet-color;
  }

  &--P {
    color: $pink-color;
  }

  &--P:before {
    background-color: $pink-color;
  }
}

.crm-edit__row {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 20px;

  b {
    color: rgba($gray-dark-color, .3);
    width: 94px;
    margin-right: 55px;
    display: inline-block;
  }

  .crm-edit__prices & b {
    font-size: 16px;
    color: #fff;
  }
}

.crm-edit__controls {
  position: relative;
  padding-left: 70px;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: -100px;
    height: 10000px;
    width: 10000px;
    background: $blue-color;
    z-index: 0;
  }
}

.crm-edit__tabs {
  display: flex;
  margin-bottom: 30px;
}

.crm-edit__tab {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 17px;

  &.active {
    color: $violet-color;
    padding-bottom: 7px;
    border-bottom: 2px solid $violet-color;
    cursor: default;
  }
}

.crm-edit__btn {
  color: $violet-color;
  border-color: #fff;
  padding-left: 27px;
  padding-right: 27px;
  width: 174px;
  max-width: 174px;
  display: inline-block;
  margin-right: 25px;

  &:not([disabled]):hover {
    color: $blue-color;
  }

  &:before {
    border-top: 45px solid #fff;
  }

  &.loading:hover {
    color: #fff;
  }
}

.crm-edit__clear {
  color: $violet-color;
  font-size: 15px;
  font-weight: 600;
  display: inline-block;
  cursor: pointer;

  &:hover {
    opacity: .8;
    text-decoration: none;
  }
}

.crm-edit__form {
  position: relative;
  z-index: 1;
}

.crm-edit__input {
  font-size: 15px;
  margin-bottom: 28px;
  width: 350px;

  &::placeholder {
    color: rgba($gray-dark-color, .3);
  }

  &--error {
    border-bottom-color: red;
  }
}

.crm-edit__error {
  &--form,
  &--access {
    color: #fff;
    font-weight: 600;
  }

  &--access {
    z-index: 1;
    position: relative;
  }

  &--invoices {
    margin-top: 20px;
  }
}

.crm-edit__data-item {
  color: $violet-color;
  margin-bottom: 10px;

  b {
    display: block;
  }
}

.crm-edit__invoices {
  margin-top: 10px;
  margin-bottom: 34px;

  .id {
    width: 37px;
  }

  .time {
    width: 160px;
  }

  .status {
    width: 108px;
  }
}

.crm-edit__invoices-titles {
  span {
    font-size: 15px;
    font-weight: 600;
    font-style: italic;
  }
}

.crm-edit__invoices-titles,
.crm-edit__invoice {
  display: flex;

  span {
    margin-right: 10px;
  }
}

.crm-edit__invoice {
  margin-bottom: 5px;
  align-items: center;

  svg {
    width: 15px;
    height: 15px;
    margin-right: 10px;
    cursor: pointer;

    &:hover {
      opacity: .7;
    }
  }
}

.crm-edit__icon {
  margin-right: 10px;
  cursor: pointer;
  display: inline-block;
  width: 15px;
  height: 15px;
  background-repeat: no-repeat;
  background-size: cover;

  &:hover {
    opacity: .7;
  }

  &--info {
    background-image: url('/assets/icons/info.svg');
  }

  &--edit {
    background-image: url('/assets/icons/edit.svg');
  }

  &--payment {
    background-image: url('/assets/icons/wallet-crm.svg');
  }
}

.crm-edit__invoices-content {
  margin-top: 5px;
}

.crm-edit__popup {

  &--json {
    .modal-container {
      width: 60%;
      max-width: 800px;
      max-height: 600px;
      overflow-y: scroll;
    }
  }
}
</style>
