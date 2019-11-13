<template>
  <div class="ca-orders">
    <div class="internal__tabs">
      <h2 class="internal__tab internal__tab--active">Current orders</h2>
      <h2 class="internal__tab" @click="onNewOrderClick">Make new order</h2>
    </div>
    <div class="orders-preloader" v-if="loading"><img src="/assets/images/preloader.gif"></div>
    <ordersTable v-if="items.length > 0 && !loading" class="ca-orders__table" showFilter initialSortField="number" initialSortOrder="asc" :items="items" :columns="columns" />
    <div v-else-if="items.length === 0 && !loading" class="ca-orders__message">You don't have active orders</div>
    <div class="ca-orders__archive" v-if="archive.length > 0">
      <div class="ca-orders__archive-top">
        <h2>Archived</h2>
        <btn :btnAction="clearArchive">Clear history</btn>
      </div>
      <div class="orders-preloader" v-if="archiveLoading"><img src="/assets/images/preloader.gif"></div>
      <ordersTable v-if="archive.length > 0 && !archiveLoading" class="ca-orders__table ca-orders__table--archive" initialSortField="number" initialSortOrder="asc" :items="archive" :columns="columnsArchive" />
    </div>
  </div>
</template>

<script>
import axios from './../../../libs/axios';
import ordersTable from './OrdersTable.vue';
import { TimeHelpers } from './../../../libs/helpers/time';
import { CountHelpers } from './../../../libs/helpers/count';
import moment from 'moment';

export default {
  name: 'caOrders',
  components: {
    ordersTable
  },
  data() {
    return {
      items: [],
      // archive: [],
      columns: [
        {name: 'number', label: `№`, type: 'numeric', sort: true, filter: true },
        {name: 'render', label: 'Render', type: '', sort: false, filter: false, formatter: this.formatRenders, hidden: true }, //temporarly hidden
        {name: 'end', label: 'End time', type: '', sort: false, filter: false },
        {name: 'node', label: 'Node type', type: '', sort: true, filter: true },
        {name: 'start', label: 'Start time', type: '', sort: true, filter: true },
        {name: 'duration', label: 'Duration (h)', type: 'numeric', sort: true, filter: true },
        {name: 'price', label: 'Price (€)', type: 'numeric', sort: true, filter: true },
        {name: 'left', label: 'Time left', type: 'date:HH:mm:ss', sort: true, filter: true },
        {name: 'status', label: 'Order status', type: '', sort: true, filter: true, formatter: this.formatOrderStatus },
        {name: 'gpuStatus', label: 'GPU status', type: '', sort: true, filter: true, formatter: CountHelpers.formatGPUStatus },
        {name: 'button', label: '', type: '', sort: false, filter: false, formatter: this.formatButton},
        {name: 'action', label: '', type: '', sort: false, filter: false, formatter: this.formatAction},
      ],
      columnsArchive: [
        {name: 'number', label: `№`, type: 'numeric', sort: false, filter: false },
        {name: 'render', label: 'Render', type: '', sort: false, filter: false, formatter: this.formatRenders, hidden: true }, //temporarly hidden
        {name: 'node', label: 'Node type', type: '', sort: false, filter: false },
        {name: 'start', label: 'Start time', type: '', sort: false, filter: false },
        {name: 'duration', label: 'Duration (h)', type: 'numeric', sort: false, filter: false },
        {name: 'price', label: 'Price (€)', type: 'numeric', sort: false, filter: false },
        {name: 'left', label: 'Time left', type: 'numeric', sort: false, filter: false },
        {name: 'status', label: 'Order status', type: '', sort: false, filter: false, formatter: this.formatOrderStatus },
        {name: 'button', label: '', type: '', sort: false, filter: false, formatter: this.formatButton},
      ],
      loading: false,
      archiveLoading: false,
      ordersData: 'api/my-orders/',
      polling: null,
    }
  },
  computed: {
    archive () {
      return this.$store.state.clientsarea.archive;
    },
    orders () {
      return this.$store.state.clientsarea.orders;
    }
  },
  mounted() {
    if (this.$store.state.user.isAuthorized) {
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
    onDocumentClick(e) {
      const hiddenClass = 'hidden';

      this.$nextTick(function() {
        if (e.target.classList.contains('table-component__th')) {
          this.setStatuses();
        } else if (e.target.classList.contains('ca-orders__btn--pending')) {
          this.$store.commit('setOrderId', e.target.dataset.order);
          this.$store.commit('setPaymentPage');
        } else if (e.target.classList.contains('ca-orders__btn--paid')) {
          this.openOrderData(e.target);
        } else if (e.target.classList.contains('ca-orders__action')) {
          e.target.querySelector('.ca-orders__perform').classList.toggle(hiddenClass);
        }
        else if (e.target.classList.contains('ca-orders__perform--cancel')) {
          this.cancelOrder(e.target, e.target.dataset.order);
        }  else if (!e.target.classList.contains('ca-orders__action')
          && !e.target.classList.contains('ca-orders__perform--cancel')) {
          document.querySelectorAll('.ca-orders__perform').forEach((el) => {
            if (!el.classList.contains(hiddenClass)) {
              el.classList.add(hiddenClass);
            }
          })
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
    setOrder() {
      this.$nextTick(function() {
        let ordersArray = document.querySelectorAll('.ca-orders__btn');
        let order;

        if(ordersArray.length > 0) {
          ordersArray.forEach((el, index) => {
            order = el.dataset.order;
          })
        }
      })
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
      this.setStatus('C');
      this.setStatus('R');
      this.setStatus('F');
    },
    setLeft(status, duration, start, end) {
      if ((status === 'P') || (status === 'W') || (status === 'C') || (status === 'R')) {
        return `${duration}:00:00`;
      } else {
        return TimeHelpers.countTimeLeft(start, end);
      }
    },
    setButton(status, order) {
      if (status === 'P') {
        return 'pending';
      } else {
        return 'paid';
      }
    },
    compareOrders(source, updated) {
      let result = [];
      let isInArchive;

      updated.forEach((el) => {
        source.forEach((element, index) => {
          if (((el.status === 'C') || (el.status === 'F'))
            && (el.id === element.id)
            && (el.status !== element.status)) {

            this.archive.forEach(e => {
              if (e.number === el.id) {
                isInArchive = true;
              }
            })

            if (!isInArchive) {
              result.push(el);
            }
          }
        })
      })

      return result;
    },
    getOrders() {
      let _self = this;

      axios
      .get(this.ordersData)
      .then(function(response){
        let startTime;
        let endTime;
        let start;
        let archive = _self.archive;
        let compareResult = [];
        let existsInArchive = false;

        if(response.status === 200) {
          _self.loading = false;
          _self.archiveLoading = false;

          _self.items = [];

          if (_self.orders.length === 0) {
            _self.$store.commit('setOrders', response.data);
          } else {
            compareResult = _self.compareOrders(_self.orders, response.data);
          }

          console.log(response.data);

          response.data.forEach((el) => {
            startTime = TimeHelpers.localizeDateTime(el.begin_time).toFormat('dd/MM/yyyy H:mm');
            endTime = TimeHelpers.localizeDateTime(el.end_time).toFormat('dd/MM/yyyy H:mm');

            if ((el.status !== 'F') && (el.status !== 'C')) {
              start = moment(moment(new Date()).format('DD/MM/YYYY HH:mm:ss'), 'DD/MM/YYYY HH:mm:ss');
              _self.items.push({
                number: el.id,
                render: `${el.software.editor.id},${el.software.render.id}`,
                node: `${el.rig_instance.rig_type.name}`,
                start: startTime,
                end: endTime,
                duration: TimeHelpers.countHoursDuration(startTime, endTime),
                price: +el.initial_price,
                status: el.status,
                gpuStatus: el.node_rendering,
                left: _self.setLeft(
                  el.status,
                  TimeHelpers.countHoursDuration(startTime, endTime),
                  start,
                  endTime
                ),
                button: `${el.id},${el.status}`,
                action: `${el.id},${el.status}`
              });

            } else {
              if(!_self.$store.state.clientsarea.isArchiveCleaned) {
                if (el.status === 'C') {
                  start = moment(moment(new Date()).format('DD/MM/YYYY HH:mm:ss'), 'DD/MM/YYYY HH:mm:ss');
                } else {
                  start = moment(TimeHelpers.localizeDateTime(el.begin_time).toFormat('dd/MM/yyyy H:mm:ss'), 'DD/MM/YYYY HH:mm:ss');
                }

                // check to avoid duplicates

                archive.forEach(element => {
                  if (element.number === el.id) {
                    existsInArchive = true;
                  } else {
                    existsInArchive = false;
                  }
                })

                //

                if(!existsInArchive) {
                  archive.push({
                    number: el.id,
                    render: `${el.software.editor.id},${el.software.render.id}`,
                    node: `${el.rig_instance.rig_type.name}`,
                    start: startTime,
                    duration: TimeHelpers.countHoursDuration(startTime, endTime),
                    price: +el.initial_price,
                    status: el.status,
                    left: _self.setLeft(
                      el.status,
                      TimeHelpers.countHoursDuration(startTime, endTime),
                      start,
                      endTime
                    ),
                    button: `${el.id},${el.status}`
                  });
                }
              }
            }
          });

          if (compareResult.length > 0) {
            compareResult.forEach(el => {
              startTime = TimeHelpers.localizeDateTime(el.begin_time).toFormat('dd/MM/yyyy H:mm');
              endTime = TimeHelpers.localizeDateTime(el.end_time).toFormat('dd/MM/yyyy H:mm');

              if (el.status === 'C') {
                start = moment(moment(new Date()).format('DD/MM/YYYY HH:mm:ss'), 'DD/MM/YYYY HH:mm:ss');
              } else {
                start = moment(TimeHelpers.localizeDateTime(el.begin_time).toFormat('dd/MM/yyyy H:mm:ss'), 'DD/MM/YYYY HH:mm:ss');
              }

              archive.push({
                number: el.id,
                render: `${el.software.editor.id},${el.software.render.id}`,
                node: `${el.rig_instance.rig_type.name}`,
                start: startTime,
                duration: TimeHelpers.countHoursDuration(startTime, endTime),
                price: +el.initial_price,
                status: el.status,
                left: _self.setLeft(
                  el.status,
                  TimeHelpers.countHoursDuration(startTime, endTime),
                  start,
                  endTime
                ),
                button: `${el.id},${el.status}`
              });
            })
          }

          _self.setStatuses();
          _self.checkReservedOrders();

          if (_self.items.length > 0) {
            _self.insertOrderData();
            _self.setOrder();
            _self.$store.commit('setOrders', response.data);
          }

          if (archive.length > 0) {
            _self.$store.commit('setArchive', archive);
          }
        }
      });
    },
    insertOrderData() {
      this.$nextTick(function() {
        let rows = document.querySelectorAll('.orders-table__body tr:not(.ca-orders__data)');
        let columnAmount =
        document.querySelector('.orders-table__body tr:not(.ca-orders__data)').children.length;
        let orderId;

        rows.forEach((el) => {
          if (!el.classList.contains('P')
            && !el.classList.contains('C')
            && !el.classList.contains('R')
            && !el.classList.contains('F')
            && (!el.nextSibling || !el.nextSibling.classList.contains('ca-orders__data'))) {
            let newRow = document.createElement('tr');
            el.after(newRow);
            let newColumn = document.createElement('td');
            newRow.appendChild(newColumn);
            newColumn.setAttribute('colspan', columnAmount);
            newRow.setAttribute('class', 'ca-orders__data hidden');
            orderId = el.querySelector('[data-order]').dataset.order;
            newRow.setAttribute('data-order-content', orderId);
          }
        })
      })
    },
    openOrderData(el){
      let sibling = el.parentNode.parentNode.nextSibling;
      while(!/tr/i.test(sibling.nodeName)){
        sibling = sibling.nextSibling;
      }
      sibling.classList.toggle('hidden');

      let orderId = el.dataset.order;
      let ftpLogin;
      let ftpPassword;
      let tvLogin;
      let tvPassword;
      let errorMessage = 'The access is not set yet. Check it later.';
      let successMessage;

      axios
      .get(`api/order/${orderId}/access/`)
      .then((response) => {
        if (response.status === 200) {
          ftpLogin = response.data.ftp_username;
          ftpPassword = response.data.ftp_password;
          tvLogin = response.data.tv_username;
          tvPassword = response.data.tv_password;
          successMessage = `
            <div class="ca-orders__data-row">
              <b>FTP</b>
              <div class="ca-orders__data-item"><span>Login:</span>${ftpLogin}</div>
              <div class="ca-orders__data-item"><span>Password:</span>${ftpPassword}</div>
            </div>
            <div class="ca-orders__data-row">
              <b>Team Viewer</b>
              <div class="ca-orders__data-item"><span>Login:</span>${tvLogin}</div>
              <div class="ca-orders__data-item"><span>Password:</span>${tvPassword}</div>
            </div>`;

          this.$nextTick(function() {
            document.querySelector(`[data-order-content="${orderId}"] td`).innerHTML = successMessage;
          })
        }
      })
      .catch(error => {
        if(error.response.status === 404) {
          this.$nextTick(function() {
            document.querySelector(`[data-order-content="${orderId}"] td`).innerHTML = errorMessage;
          })
        }
      })
    },
    checkReservedOrders() {
      this.$nextTick(function() {
        let reservedOrders = document.querySelectorAll('tr.R');
        let start = moment(new Date()).format('DD/MM/YYYY HH:mm');
        let end;

        reservedOrders.forEach((el) => {
          end = el.querySelector('.end').innerHTML;

          if (TimeHelpers.countDaysDuration(start, end) <= 20) {
            el.querySelector('.ca-orders__btn').removeAttribute('disabled');
            el.querySelector('.ca-orders__btn span').classList.add('hidden');
          }
        })
      })
    },
    formatOrderStatus(value) {
      switch(value) {
        case 'P': return `<span data-status=${value}>Waiting for payment</span>`;
        case 'W': return `<span data-status=${value}>Waiting for begin</span>`;
        case 'I': return `<span data-status=${value}>In progress</span>`;
        case 'C': return `<span data-status=${value}>Canceled</span>`;
        case 'R': return `<span data-status=${value}>Reserved</span>`;
        case 'F': return `<span data-status=${value}>Finished</span>`;
      }
    },
    formatRenders(value) {
      let valueArray = value.split(',');
      return `<svg><use xlink:href="#sprite-${valueArray[0]}"></use></svg><svg><use xlink:href="#sprite-${valueArray[1]}"></use></svg>`;
    },
    formatButton(value) {
      let valueArray = value.split(',');
      switch(valueArray[1]) {
        case 'P': return `<button class="ca-orders__btn ca-orders__btn--pending" data-order="${valueArray[0]}"></button>`;
        case 'R': return `<button class="ca-orders__btn ca-orders__btn--pending" disabled data-order="${valueArray[0]}"><span>You will be able to finish payment 20 days before the order end time</span></button>`;
        case 'C': return `<div class="ca-orders__btn ca-orders__btn--archive" data-order="${valueArray[0]}"></div>`;
        default: return `<button class="ca-orders__btn ca-orders__btn--paid" data-order="${valueArray[0]}"></button>`;
      }
    },
    formatAction(value) {
      let valueArray = value.split(',');
      const cancelAction = `<button class="ca-orders__action"><div class="ca-orders__perform ca-orders__perform--cancel hidden" data-order="${valueArray[0]}">Cancel</div></button>`;
      const completeAction = `<button class="ca-orders__action"><div class="ca-orders__perform ca-orders__perform--cancel hidden" data-order="${valueArray[0]}">Complete</div></button>`;
      const reservedAction = ``;

      if ((valueArray[1] === 'P') || (valueArray[1] === 'W')) {
        return cancelAction;
      } else if (valueArray[1] === 'I') {
        return completeAction;
      } else if (valueArray[1] === 'R') {
        return reservedAction;
      }
    },
    cancelOrderApi(order) {
      let _self = this;
      let startTime;
      let start;
      let endTime;
      let archive = _self.archive;
      this.archiveLoading = true;

      axios
      .delete(`api/order/${order}/cancel/`)
      .then(function(response){
        startTime = TimeHelpers.localizeDateTime(response.data.begin_time).toFormat('dd/MM/yyyy H:mm');
        endTime = TimeHelpers.localizeDateTime(response.data.end_time).toFormat('dd/MM/yyyy H:mm');

        if (response.data.status === 'C') {
          start = moment(moment(new Date()).format('DD/MM/YYYY HH:mm:ss'), 'DD/MM/YYYY HH:mm:ss');
        } else {
          start = moment(TimeHelpers.localizeDateTime(response.data.begin_time).toFormat('dd/MM/yyyy H:mm:ss'), 'DD/MM/YYYY HH:mm:ss');
        }

        if (response.status === 200) {
          _self.archiveLoading = false;

          _self.archive.push({
            number: response.data.id,
            render: `${response.data.software.editor.id},${response.data.software.render.id}`,
            node: `${response.data.rig_instance.rig_type.name}`,
            start: startTime,
            duration: TimeHelpers.countHoursDuration(startTime, endTime),
            price: +response.data.initial_price,
            status: response.data.status,
            left: _self.setLeft(
              response.data.status,
              TimeHelpers.countHoursDuration(startTime, endTime),
              start,
              endTime
            ),
            button: `${response.data.id},${response.data.status}`,
          });

          _self.$store.commit('setArchive', archive);
        }
      })
      .catch(error => {
          if (error.response.status === 404) {
            console.log('Order was not found');
          } else if (error.response.status === 406) {
            console.log('Order can not be cancelled');
          }
      })
    },
    cancelOrder(e, num) {
      let deleteIndex;
      e.classList.add('hidden');

      // let i = e.parentNode.parentNode.parentNode.rowIndex;
      // document.querySelector('.orders-table__table').deleteRow(i);

      this.items.forEach((el, i) => {
        if (el.number == num) {
          deleteIndex = i;
        }
      })

      this.items.splice(deleteIndex, 1);
      this.cancelOrderApi(num);
      this.setStatuses();
    },
    clearArchive() {
      this.$store.commit('setArchive', []);

      if (!this.$store.state.clientsarea.isArchiveCleaned) {
        this.$store.commit('setArchiveCleaned');
      }
    },
    onNewOrderClick() {
      this.$store.commit('setNewOrderPage');
      document.body.classList.add('neworder');
    }
  }
}
</script>

<style lang="scss">
.ca-orders__table {
  margin-bottom: 60px;

  th.end,
  td.end {
    display: none;
  }

  .button,
  .action {
    width: 65px;
    position: relative;
  }

  .action {
    padding: 0;
    line-height: 0;
  }

}

.ca-orders__btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 65px;
  height: 65px;
  background: $blue-color;
  background-repeat: no-repeat;
  background-position: 50%;
  cursor: pointer;
  border: none;

  &[disabled] {
    background-color: rgba($blue-color, .5);
    cursor: default;

    span {
      display: none;
    }
  }

  &[disabled]:hover {
    span {
      display: block;
      position: absolute;
      width: 100px;
      color: #000;
      bottom: 0;
      background: #fff;
      padding: 10px;
      z-index: 1;
    }
  }

  &:focus {
    outline: none;
  }

  &--archive {
    cursor: default;
  }
}

.ca-orders__data td {
  background: #f6f6f6;
}

.ca-orders__action {
  cursor: pointer;
  border: none;
  background: transparent;
  width: 65px;
  height: 65px;
  position: relative;
  background-image: url('/assets/icons/more.svg');
  background-size: 5px 19px;
  background-repeat: no-repeat;
  background-position: 50%;

  &:focus {
    outline: none;
  }

  svg {
    width: 5px;
    height: 19px;
  }
}

.ca-orders__perform {
  position: absolute;
  bottom: -65px;
  right: 0;
  width: 130px;
  height: 65px;
  z-index: 1;
  background: #fff;
  box-shadow: 0 3px 26px 0 rgba(136, 136, 136, 0.16);
  cursor: pointer;
  padding-left: 15px;
  text-align: left;
  display: flex;
  align-items: center;
  font-weight: 600;

  &:hover {
    color: rgba($gray-dark-color,.7);
  }
}

.ca-orders__table--archive {
  position: relative;

  thead {
    display: none;
  }

  tbody {
    color: rgba($gray-dark-color, .15);
    tr {
      background: #e9eaea;
    }
  }

  .ca-orders__btn {
    background: #dbddde;
  }

  td.status:before {
    background: rgba($gray-dark-color, .15);
  }

  .ca-orders__btn {
    background-image: url('/assets/icons/progress.svg');
    background-size: 25px 21px;
    background-repeat: no-repeat;
    background-position: 50%;
  }
}

.ca-orders__message {
  margin-bottom: 24px;
}

.ca-orders__archive-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;

  h2 {
    margin-bottom: 0;
  }

  .sixnines-btn {
    color: $violet-color;
    margin: 0;
    max-width: 190px;
    padding-left: 30px;
    padding-right: 30px;

    &:hover {
      color: #fff;
    }
  }

  @include bp(desktop--big) {
    .sixnines-btn {
      max-width: 190px;
    }
  }
}

.ca-orders__archive {
  h2 {
    color: $violet-color;
  }

  td {
    cursor: default;
  }
}

.ca-orders__data-row {
  display: flex;
  margin-bottom: 18px;

  b{
    font-weight: 700;
    width: 200px;
  }
}

.ca-orders__data-item {
  margin-right: 96px;
  min-width: 233px;

  span {
    opacity: .2;
    width: 96px;
    display: inline-block;
  }
}

</style>
