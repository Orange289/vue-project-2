import axios from '../axios';
import vue from './../../App';

const resource = 'api/check-order/';
import { Methods } from './methods';

async function createOrder() {
  let data = await Methods.createOrder();

  this.$store.commit('setOrderId', data);

  window.location.href = ('/clientsarea/');
  this.$store.commit('setPaymentPage'); // Redirecting on clientsarea payment page
  this.$store.commit('resetOrderCreation');
}

export default {

  get(payload) {
    return axios.post(resource, {
      render: vue.store.state.render,
      editor: vue.store.state.program,
      rig_type: vue.store.state.server,
      duration: vue.store.state.duration,
      begin_time: vue.store.state.datetime
    }, payload)
      .then(response => {
        if (response.status === 200) {
          vue.store.commit('resetBadRequestError');
          vue.store.commit('resetTimeOccupiedError');
          if (!vue.store.state.user.isAuthorized) {
            vue.store.commit('setOrderCreation');
            window.location.href = ('/signin/');
          } else {
            createOrder();
          }
        }
      }).catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          vue.store.commit('setBadRequestError');
          vue.store.commit('resetTimeOccupiedError');
        } else if (error.response.status === 404) {
          vue.store.commit('resetBadRequestError');
          vue.store.commit('setTimeOccupiedError');
        }
      });
  }
}

