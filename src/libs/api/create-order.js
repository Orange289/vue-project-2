import axios from '../axios';
import vue from './../../App';

const resource = 'api/order/';

export default {
  get (payload) {
    return axios.post(resource, {
      render: vue.store.state.render,
      editor: vue.store.state.program,
      rig_type: vue.store.state.server,
      duration: vue.store.state.duration,
      begin_time: vue.store.state.datetime
    }, payload)
      .then(response => {
        if (response.status === 201) {
          window.location.href = '/clientsarea/';
          vue.store.commit('setPaymentPage'); // Redirecting on clientsarea payment page
          vue.store.commit('resetOrderCreation');
          vue.store.commit('setOrderId', response.data.order_id);

          if (vue.store.state.user.isAuthorized) {
            return response.data.order_id;
          }
        }
      })
      .catch((error) => {
        this.$store.commit('setOrdersPage');

        if (error.response.status === 400) {
          vue.store.commit('setBadRequestError');
          vue.store.commit('resetTimeOccupiedError');
        } else if (error.response.status === 409) {
          vue.store.commit('resetBadRequestError');
          vue.store.commit('setTimeOccupiedError');
        }
      });
  }
}
