import axios from '../axios';
import vue from './../../App';

import { TimeHelpers } from './../helpers/time';

const resource = 'api/nearest-time/';

export default {
  get (payload) {
    return axios.post(resource, {
      render: vue.store.state.render,
      editor: vue.store.state.program,
      rig_type: vue.store.state.server,
      duration: vue.store.state.duration
    }, payload)
      .then(response => {
        let datetime = vue.store.state.datetime;

        vue.store.commit('resetBadRequestError');
        vue.store.commit('resetTimeOccupiedError');

        datetime = response.data.date;
        vue.store.commit('setDateTime', datetime);
        let nearestDateTime = TimeHelpers.localizeDateTime(response.data.date).toFormat('dd/MM/yyyy HH:mm');

        vue.store.commit('setDate', nearestDateTime.substr(0, 10));
        vue.store.commit('setTime', nearestDateTime.substr(11));
        vue.store.commit('setNearestFound');
      })
      .catch((error)=> {
        console.log(error.response.status);
        if (error.response.status === 400) {
            vue.store.commit('setBadRequestError');
            vue.store.commit('resetTimeOccupiedError');
          } else if (error.response.status === 404) {
            vue.store.commit('resetBadRequestError');
            vue.store.commit('setTimeOccupiedError');
          }
      })
  }
}
