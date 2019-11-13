import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import App from './App.vue'
import 'idempotent-babel-polyfill'

const Index = () => import(/* webpackChunkName: "index" */ './components/pages/landing.vue');
const SignIn = () => import(/* webpackChunkName: "index" */ './components/pages/signin.vue');
const Clientsarea = () => import(/* webpackChunkName: "index" */ './components/pages/clientsarea.vue');
const PaymentResult = () => import(/* webpackChunkName: "index" */ './components/pages/payment-result.vue');
const Crm = () => import(/* webpackChunkName: "index" */ './components/pages/crm.vue');
const MultiService = () => import(/* webpackChunkName: "index" */ './components/pages/multiservice.vue');

Vue.use(VueRouter);
Vue.use(Meta);

const routes = [
  { path: '/', name: 'home', component: Index },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/clientsarea', name: 'Clientsarea', component: Clientsarea },
  { path: '/clientsarea/payment-result', name: 'Payment Result', component: PaymentResult },
  { path: '/crm', name: 'Crm', component: Crm },
  { path: '/multiservice-rent', name: 'MultiService', component: MultiService },
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router,
  render: h => h(App),
  mounted() {
    // You'll need this for renderAfterDocumentEvent.
    document.dispatchEvent(new Event('render-event'))
  }
});
