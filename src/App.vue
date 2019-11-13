<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Vuelidate from 'vuelidate';
import { TableComponent, TableColumn } from 'vue-table-component';
import 'vue-multi-ref';
import vSelect from 'vue-select';

import btn from './components/general/Button.vue';
import container from './components/general/Container.vue';
import tabs from './components/general/Tabs.vue';
import breadcrumbs from './components/general/Breadcrumbs.vue';
import logo from './components/general/Logo.vue';
import topHeader from './components/general/TopHeader.vue';
import Footer from './components/general/Footer.vue'
import axios from 'axios';

import VueLuxon from 'vue-luxon';
Vue.use(VueLuxon);

import { TimeHelpers } from './libs/helpers/time';

Vue.component('btn', btn);
Vue.component('container', container);
Vue.component('tabs', tabs);
Vue.component('breadcrumbs', breadcrumbs);
Vue.component('logo', logo);
Vue.component('topHeader', topHeader);
Vue.component('Footer', Footer);
Vue.component('table-component', TableComponent);
Vue.component('table-column', TableColumn);
Vue.component('v-select', vSelect);

Vue.use(Vuex);
Vue.use(Vuelidate);

const store = new Vuex.Store ({
  state() {
    return {
      currTz: null,
      render: 1,
      rActiveIndex: 0,
      program: 1,
      pActiveIndex: 0,
      server: 2,
      sActiveIndex: 0,
      duration: 1,
      isNearestFound: false,
      price: null,
      date: null,
      time: null,
      datetime: null,
      isOrderCreation: false,
      tariffs: {
        less24: null,
        more24: null,
        more72: null,
        currentTariff: null,
        isTariffsLoaded: false
      },
      user: {
        isLogin: true,
        isReg: false,
        isForgot: false,
        isAuthorized: false,
        authToken: '',
        userId: 0,
        email: '',
      },
      clientsarea: {
        isOrdersPage: true,
        isNewOrderPage: false,
        isPaymentPage: false,
        orderId: null,
        isArchiveCleaned: false,
        archive: [],
        orders: []
      },
      crm: {
        isOrderEditPage: false,
        orderId: null,
        status: null,
        datetime: null,
        render: null,
        program: null,
        server: null,
        duration: null,
        initialPrice: null,
        finalPrice: null,
        orderNotFound: false,
        invoices: [],
        isLoading: false,
        dataExists: false,
        accessError: false,
        gpuStatus: null
      },
      errors: {
        isBadRequestError: false,
        isTimeOccupiedError: false
      },
      multiservice: {
        service: 'Rendering',
        mActiveIndex: 0,
        id: 'rendering',
        amount: 1,
        duration: 1,
        email: '',
        company: '',
        phone: '',
        promocode: '',
        totalEuro: null,
        totalGfps: null
      }
    }
  },
  getters: {
    authToken: state => {
      return state.user.isAuthorized ? state.user.authToken : null;
    }
  },
  mutations: {
    setTimeZone(state, currTz) {
      state.currTz = currTz;
    },
    setRender(state, payload) {
      state.render = payload.render;
      state.rActiveIndex = payload.rActiveIndex;
    },
    setProgram(state, payload) {
      state.program = payload.program;
      state.pActiveIndex = payload.pActiveIndex;
    },
    setServer(state, payload) {
      state.server = payload.server;
      state.sActiveIndex = payload.sActiveIndex;
    },
    setLess24(state, less24) {
      state.tariffs.less24 = less24;
    },
    setMore24(state, more24) {
      state.tariffs.more24 = more24;
    },
    setMore72(state, more72) {
      state.tariffs.more72 = more72;
    },
    setCurrentTariff(state, tariff) {
      state.tariffs.currentTariff = tariff;
    },
    setTariffLoaded(state) {
      state.tariffs.isTariffsLoaded = true;
    },
    setDuration(state, duration) {
      state.duration = duration;
    },
    countPrice(state, price) {
      state.price = price
    },
    setNearestFound(state) {
      state.isNearestFound = true;
    },
    setDate(state, date) {
      state.date = date;
    },
    setTime(state, time) {
      state.time = time
    },
    setDateTime(state, datetime) {
      state.datetime = datetime;
    },
    setAuthentication(state, payLoad) {
      state.user.isAuthorized = payLoad.isAuthorized;
      state.user.authToken = payLoad.token;
      state.user.userId = payLoad.userId;
      state.user.email = payLoad.email;
    },
    setLogin(state) {
      state.user.isLogin = true;
      state.user.isReg = false;
      state.user.isForgot = false;
    },
    setReg(state) {
      state.user.isReg = true;
      state.user.isLogin = false;
      state.user.isForgot = false;
    },
    setForgot(state) {
      state.user.isReg = false;
      state.user.isLogin = false;
      state.user.isForgot = true;
    },
    setOrderCreation(state) {
      state.isOrderCreation = true;
    },
    resetOrderCreation(state) {
      state.isOrderCreation = false;
    },
    setOrdersPage(state) {
      state.clientsarea.isOrdersPage = true;
      state.clientsarea.isNewOrderPage = false;
      state.clientsarea.isPaymentPage = false;
    },
    setNewOrderPage(state) {
      state.clientsarea.isOrdersPage = false;
      state.clientsarea.isNewOrderPage = true;
      state.clientsarea.isPaymentPage = false;
    },
    setPaymentPage(state) {
      state.clientsarea.isOrdersPage = false;
      state.clientsarea.isNewOrderPage = false;
      state.clientsarea.isPaymentPage = true;
    },
    setBadRequestError(state) {
      state.errors.isBadRequestError = true;
    },
    setTimeOccupiedError(state) {
      state.errors.isTimeOccupiedError = true;
    },
    resetBadRequestError(state) {
      state.errors.isBadRequestError = false;
    },
    resetTimeOccupiedError(state) {
      state.errors.isTimeOccupiedError = false;
    },
    setOrderId(state, orderId) {
      state.clientsarea.orderId = orderId;
    },
    setMultiservice(state, payload) {
      state.multiservice.service = payload.service;
      state.multiservice.mActiveIndex = payload.mActiveIndex;
      state.multiservice.id = payload.id;
    },
    setMultiserviceDuration(state, duration) {
      state.multiservice.duration = duration;
    },
    setMultiserviceAmount(state, amount) {
      state.multiservice.amount = amount;
    },
    setMultiserviceEmail(state, email) {
      state.multiservice.email = email;
    },
    setMultiserviceCompany(state, company) {
      state.multiservice.company = company;
    },
    setMultiservicePhone(state, phone) {
      state.multiservice.phone = phone;
    },
    setMultiservicePromo(state, promocode) {
      state.multiservice.promocode = promocode;
    },
    setMultiserviceEuro(state, euro) {
      state.multiservice.totalEuro = euro;
    },
    setMultiserviceGfps(state, gfps) {
      state.multiservice.totalGfps = gfps;
    },
    setArchiveCleaned(state) {
      state.clientsarea.isArchiveCleaned = true;
    },
    resetArchiveCleaned(state) {
      state.clientsarea.isArchiveCleaned = false;
    },
    setArchive(state, payload) {
      state.clientsarea.archive = [...payload];
    },
    setOrders(state, payload) {
      state.clientsarea.orders = [...payload];
    },
    setOrderEditPage(state) {
      state.crm.isOrderEditPage = true;
    },
    resetOrderEditPage(state) {
      state.crm.isOrderEditPage = false;
    },
    setCrmOrderId(state, orderId) {
      state.crm.orderId = orderId;
    },
    setCrmOrderData(state, payload) {
      state.crm.status = payload.status;
      state.crm.datetime = payload.datetime;
      state.crm.render = payload.render;
      state.crm.program = payload.program;
      state.crm.server = payload.server;
      state.crm.duration = payload.duration;
      state.crm.initialPrice = payload.initialPrice;
      state.crm.finalPrice = payload.finalPrice;
      state.crm.invoices = [...payload.invoices];
      state.crm.gpuStatus = payload.gpuStatus;
    },
    setOrderNotFound(state) {
      state.crm.orderNotFound = true;
    },
    resetOrderNotFound(state) {
      state.crm.orderNotFound = false;
    },
    setCrmLoading(state) {
      state.crm.isLoading = true;
    },
    resetCrmLoading(state) {
      state.crm.isLoading = false;
    },
    setDataExists(state) {
      state.crm.dataExists = true;
    },
    resetDataExists(state) {
      state.crm.dataExists = false;
    },
    setAccessError(state) {
      state.crm.accessError = true;
    },
    resetAccessError(state) {
      state.crm.accessError = false;
    }
  },
  plugins: [createPersistedState()]
});

export default {
  name: 'app',
  metaInfo: {
    title: 'SixNines',
  },
  store,
  components: {
  },
  mounted() {
    TimeHelpers.setCurrentTz();
  }
}
</script>

<style lang="scss">
@import "vue-select/src/scss/vue-select.scss";

html {
  font-family: $font-primary;
  font-size: $font-size-base;
  color: $text-color;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

main {
  position: relative;
}

body:not(.body-multiservice) {
  @include bp(0 tablet) {
    width: $container-max-width;
  }
}

h2 {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 20px;

  @include bp(tablet) {
    font-size: 38px;
    margin-bottom: 33px;
  }

  @include bp(desktop--big) {
    font-size: 50px;
  }
}

a {
  color: $link-color;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

body.openedMenu {
  overflow: hidden;
  height: 100vh;
}

.field {
  & + & {
    margin-top: 28px;
  }
}

.field__input {
  font-size: 20px;
  font-family: $font-secondary;
  color: #fff;
  border: none;
  border-bottom: 2px solid rgba(#fff, .2);
  background: transparent;
  padding: 8px 5px;
  width: 100%;

  &:focus {
    outline: none;
  }
}

.field__label {
  position: relative;
}

.field__floating-label {
  font-family: $font-secondary;
  font-size: 20px;
  color: rgba(#fff, .4);
  letter-spacing: 1.2px;
  position: absolute;
  left: 0;
  top: 0;
  transition: .2s ease all;
  cursor: text;

  .field__input:focus ~ &,
  .field__input.changed ~ & {
    font-size: 10px;
    top: -16px;
    left: 1px;
  }
}

.form__submit {
  margin-top: 49px;
}

.field__error,
.error {
  display: none;
  margin-top: 4px;
}

.field--error {
  input {
    border-color: red;
  }

  .field__error {
    display: block;
  }
}

.form-group--error {
  .error {
    display: block;
  }
}

.form__link {
  cursor: pointer;
}

.hidden {
  display: none !important;
}

.error-note {
  font-weight: bold;
  margin-bottom: 24px;
}

.login-message {
  font-size: 24px;
  height: calc(100vh - 396px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.internal__tabs {
  display: flex;
  margin-bottom: 20px;
}

.internal__tab {
  margin-right: 40px;
  color: $blue-color;
  cursor: pointer;

  &--active {
    color: $violet-color;
    cursor: default;
  }
}

.orders-preloader {
  text-align: center;
  margin-top: -20px;
  margin-bottom: 40px;
}

// Popup simplert styles

.simplert__footer {
  display: none;
}

.simplert__body {
  max-height: 760px;
  overflow-y: scroll;
  padding-bottom: 56px !important;
}

.simplert__x {
  font-size: 14px !important;
  color: $gray-dark-color !important;
}
</style>
