import axios from '../axios';

const resource = 'api/my-orders/';

export default {
  get () {
    return axios.get(`${resource}`);
  }
};
