import axios from 'axios';
import vue from 'App';
import config from '../config';

const serverUrl = config.apiUrl;

axios.defaults.baseURL = serverUrl;

axios.interceptors.request.use(request => {
  if(vue.store.getters.authToken)
    request.headers['Authorization'] = `Token ${vue.store.getters.authToken}`;
  return request;
});

export default axios;
