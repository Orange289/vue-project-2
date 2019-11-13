<template>
  <div class="crm-orders">
    <div class="internal__tabs">
      <h2 :class="['internal__tab', {'internal__tab--active': isCurrentOrders}]" @click="onOrdersClick">
        Current orders
      </h2>
      <h2 :class="['internal__tab', {'internal__tab--active': !isCurrentOrders}]" @click="onArchiveClick">
        Archived
      </h2>
    </div>
    <div class="orders-preloader" v-if="loading"><img src="/assets/images/preloader.gif"></div>
    <ordersTable v-if="isCurrentOrders && orders.length > 0 && !loading" class="crm-orders__table" showFilter initialSortField="number" initialSortOrder="asc" :items="orders" :columns="columns" />
    <div v-else-if="isCurrentOrders && orders.length === 0 && !loading" class="crm-orders__message">No active orders</div>
    <div class="crm-orders__archive" v-if="!isCurrentOrders && archive.length > 0">
      <div class="orders-preloader" v-if="archiveLoading"><img src="/assets/images/preloader.gif"></div>
      <ordersTable v-if="archive.length > 0 && !archiveLoading" class="crm-orders__table crm-orders__table--archive" initialSortField="number" initialSortOrder="asc" :items="archive" :columns="columnsArchive" showFilter />
    </div>
  </div>
</template>

<script>
import axios from './../../../libs/axios';
import ordersTable from './OrdersTable.vue';
import { TimeHelpers } from './../../../libs/helpers/time';
import moment from 'moment';

export default {
  name: 'crmOrders',
  components: {
    ordersTable
  },
  data() {
    return {
      columns: [
        {name: 'number', label: '№', type: 'numeric', sort: true, filter: true },
        {name: 'name', label: 'User', type: '', sort: true, filter: true },
        {name: 'email', label: 'Email', type: '', sort: true, filter: true },
        {name: 'render', label: 'Render', type: '', sort: false, filter: false, formatter: this.formatRenders, hidden: true }, //temporarly hidden
        {name: 'node', label: 'Node id', type: '', sort: false, filter: true },
        {name: 'start', label: 'Start time', type: '', sort: false, filter: false },
        {name: 'duration', label: 'Duration (h)', type: 'numeric', sort: true, filter: false },
        {name: 'price', label: 'Price (€)', type: 'numeric', sort: true, filter: false },
        {name: 'status', label: 'Order status', type: '', sort: true, filter: false, formatter: this.formatStatus },
      ],
      columnsArchive: [
        {name: 'number', label: '№', type: 'numeric', sort: false, filter: true },
        {name: 'name', label: 'User', type: '', sort: false, filter: true },
        {name: 'email', label: 'Email', type: '', sort: false, filter: true },
        {name: 'render', label: 'Render', type: '', sort: false, filter: false, formatter: this.formatRenders, hidden: true }, //temporarly hidden
        {name: 'node', label: 'Node type', type: '', sort: false, filter: true },
        {name: 'start', label: 'Start time', type: '', sort: false, filter: false },
        {name: 'duration', label: 'Duration (h)', type: 'numeric', sort: false, filter: false },
        {name: 'price', label: 'Price (€)', type: 'numeric', sort: false, filter: false },
        {name: 'status', label: 'Order status', type: '', sort: false, filter: false, formatter: this.formatStatus },
      ],
      isCurrentOrders: true,
      loading: false,
      archiveLoading: false,
      orders: [],
      archive: [],
      ordersData: 'api/crm/orders/',
      polling: null,
    }
  },
  computed: {
    orderId() {
      return this.$store.state.crm.orderId;
    },
    isOrderEditPage () {
      return this.$store.state.crm.isOrderEditPage;
    }
  },
  mounted() {
    if (this.$store.state.user.isAuthorized) {
      this.$store.commit('resetOrderEditPage');

      this.loading = true;
      this.archiveLoading = true;
      this.getOrders();

      this.pollData();
      document.addEventListener('click', this.onDocumentClick);
      document.addEventListener('keydown', this.onDocumentKeyDown);
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onDocumentKeyDown);
    clearInterval(this.polling);
  },
  methods: {
    pollData () {
      this.polling = setInterval(() => {
        this.getOrders();
      }, 10000)
	  },
    onOrdersClick() {
      this.isCurrentOrders = true;
      this.setStatuses();
    },
    onArchiveClick() {
      this.isCurrentOrders = false;
    },
    formatStatus(value) {
      switch(value) {
        case 'P': return `<span data-status=${value}>Waiting for payment</span>`;
        break;
        case 'W': return `<span data-status=${value}>Waiting for begin</span>`;
        break;
        case 'I': return `<span data-status=${value}>In progress</span>`;
        break;
        case 'C': return `<span data-status=${value}>Canceled</span>`;
        break;
        case 'R': return `<span data-status=${value}>Reserved</span>`;
        break;
        case 'F': return `<span data-status=${value}>Finished</span>`;
        break;
      }
    },
    onDocumentClick(e) {
      let orderId;

      this.$nextTick(function() {
        if (e.target.classList.contains('table-component__th')) {
          this.setStatuses();
        } else if (e.target.parentNode.classList.contains('W')
          || e.target.parentNode.classList.contains('P')
          || e.target.parentNode.classList.contains('R')
          || e.target.parentNode.classList.contains('I')) {

          if (e.target.parentNode.classList.contains('P')
            || e.target.parentNode.classList.contains('R')) {
            this.$store.commit('setAccessError');
          } else {
            this.$store.commit('resetAccessError');
          }

          document.querySelector('.inside__section--orders-list').classList.remove('active');

          orderId = e.target.parentNode.querySelector('.number').innerHTML;
          this.$store.commit('setCrmOrderId', orderId);
          this.$store.commit('setOrderEditPage');
          this.getOrder();
        }
      })
    },
    onDocumentKeyDown(e) {
      this.$nextTick(function() {
        if (e.target.classList.contains('table-component__filter__field')) {
          this.setStatuses();
        }
      })
    },
    getOrders() {
      let _self = this;
      this.$store.commit('resetOrderEditPage');

      axios
      .get(this.ordersData)
      .then(function(response){
        let startTime;
        let endTime;
        let start;

        if(response.status === 200) {
          _self.loading = false;
          _self.archiveLoading = false;

          _self.orders = [];
          _self.archive = [];
          console.log(response.data);

          response.data.forEach((el) => {
            startTime = TimeHelpers.localizeDateTime(el.begin_time).toFormat('dd/MM/yyyy H:mm');
            endTime = TimeHelpers.localizeDateTime(el.end_time).toFormat('dd/MM/yyyy H:mm');

            if ((el.status !== 'F') && (el.status !== 'C')) {
              start = moment(moment(new Date()).format('DD/MM/YYYY HH:mm:ss'), 'DD/MM/YYYY HH:mm:ss');
              _self.orders.push({
                number: el.id,
                name: el.user.user_name,
                email: el.user.email,
                render: `${el.software.editor.id},${el.software.render.id}`,
                node: `${el.rig_instance.instance_id}`,
                start: startTime,
                duration: TimeHelpers.countHoursDuration(startTime, endTime),
                price: +el.initial_price,
                status: el.status,

              });
            } else {
              if (response.data.status === 'C') {
                start = moment(moment(new Date()).format('DD/MM/YYYY HH:mm:ss'), 'DD/MM/YYYY HH:mm:ss');
              } else {
                start = moment(TimeHelpers.localizeDateTime(el.begin_time).toFormat('dd/MM/yyyy H:mm:ss'), 'DD/MM/YYYY HH:mm:ss');
              }

              _self.archive.push({
                number: el.id,
                name: el.user.user_name,
                email: el.user.email,
                render: `${el.software.editor.id},${el.software.render.id}`,
                node: `${el.rig_instance.rig_type.name} ${el.rig_instance.rig_type.gpu_name}`,
                start: startTime,
                duration: TimeHelpers.countHoursDuration(startTime, endTime),
                price: +el.initial_price,
                status: el.status,
              });
            }
          });

          _self.setStatuses();
        }
      });
    },
    setStatus(s) {
      this.$nextTick(function() {
        let statusesArray = document.querySelectorAll(`[data-status="${s}"]`);
        if(statusesArray.length > 0) {
          statusesArray.forEach((el, index) => {
            el.parentNode.parentNode.className = '';
            el.parentNode.parentNode.classList.add(`${s}`);
          })
        }
      })
    },
    setStatuses() {
      this.setStatus('P');
      this.setStatus('I');
      this.setStatus('W');
      this.setStatus('R');
    },
    getOrder() {
      let startTime;
      let endTime;
      let _self = this;

      this.$store.commit('setCrmLoading');

      axios.get(`api/crm/orders/${this.orderId}/`)
        .then(response => {

          if (response.status === 200) {
            this.$store.commit('resetCrmLoading');

            startTime = TimeHelpers.localizeDateTime(response.data.begin_time).toFormat('dd/MM/yyyy H:mm');
            endTime = TimeHelpers.localizeDateTime(response.data.end_time).toFormat('dd/MM/yyyy H:mm');

            _self.$store.commit('setCrmOrderData', {
              status : response.data.status,
              gpuStatus: response.data.node_rendering,
              datetime : startTime,
              render : response.data.software.render.name,
              program : response.data.software.editor.name,
              server : `${response.data.rig_instance.rig_type.name} ${response.data.rig_instance.rig_type.gpu_name}`,
              duration: TimeHelpers.countHoursDuration(startTime, endTime),
              initialPrice: +response.data.initial_price,
              finalPrice: +response.data.final_price,
              invoices: response.data.invoice_set
            })
          }
        })
        .catch(error => {
          if (error.response.status === 404) {
            _self.$store.commit('setOrderNotFound');
            _self.$store.commit('resetCrmLoading');
          }
        });
    },
  },
}
</script>

<style lang="scss">
.crm-orders__table {
  td {
    height: 65px;
    padding-left: 5px;
    padding-right: 5px;
  }

  td.status:before {
    top: 34px;
  }

  &:not(.crm-orders__table--archive) tbody tr {
    cursor: pointer;
    transition: box-shadow .3s;

    &:hover {
      box-shadow: 0px 0px 11px -2px rgba($gray-dark-color, .3);
    }
  }

  .table-component__table-wrapper {
    margin-bottom: 75px;
  }

  &:not(.crm-orders__table--archive) {
    thead,
    tbody {
      display: block;
    }

    th {
      padding-bottom: 0;
    }

    tbody {
      max-height: 616px;
      overflow-y: scroll;
    }

    .number {
      width: 65px;
    }

    .name {
      width: 143px;
    }

    .email {
      width: 131px;
    }

    .node {
      width: 161px;
    }

    .start {
      width: 136px;
    }

    .status {
      width: 198px;
    }
  }

  .name,
  .email {
    text-align: left;
  }

  .price {
    width: 80px;
  }

  .duration {
    width: 102px;
  }
}

.crm-orders__table--archive {
  position: relative;

  .number {
    width: 65px;
  }

  tbody {
    color: rgba($gray-dark-color, .15);
    tr {
      background: #e9eaea;
    }
  }

  td.status:before {
    top: 29px;
    background: rgba($gray-dark-color, .15);
  }
}

</style>
