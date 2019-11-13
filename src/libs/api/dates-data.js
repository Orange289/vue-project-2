import axios from '../axios';
import vue from './../../App';
import { TimeHelpers } from './../helpers/time';

import moment from 'moment';

const resource = 'api/find-month/';

let dates = [];

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
      let datetime = vue.store.state.datetime;

      let nearestMonth = TimeHelpers.getMonth(datetime);
      let nearestYear = TimeHelpers.getYear(datetime);
      if (response.status === 200) {

        response.data.forEach((el) => {
          dates.push(el);
        });
        return dates.map((val) => {
          return moment(`${nearestYear}-${nearestMonth}-${val}`).format('DD/MM/YYYY');
        });
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        vue.store.commit('setBadRequestError');
        vue.store.commit('resetTimeOccupiedError');
      }
    })
  }
}
