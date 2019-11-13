import { api } from './api';
const DateTimeData = api.getDateTime('DateTime');
const Dates = api.getDates('Dates');
const Times = api.getTimes('Times');
const Order = api.createOrder('Order');
const Orders = api.getOrders('Orders');
const CheckOrder = api.checkOrder('CheckOrder');

export const Methods = {
  getOrders: async () => {
    const { data } = await Orders.get();
    return data;
  },

  getDateTimeData: async () => {
    try {
      let data = await DateTimeData.get();
      return data;
    } catch (err) {
      console.log(err);
    }
  },

  getDates: async () => {
    try {
      let data = await Dates.get();
      return data;
    } catch (err) {
      console.log(err);
    }
  },

  getTimes: async () => {
    try {
      let data = await Times.get();
      return data;
    } catch (err) {
      console.log(err);
    }
  },

  createOrder: async () => {
    try {
      let data = await Order.get();
      return data;
    } catch (err) {
      console.log(err);
    }
  },

  checkOrder: async () => {
    try {
      let data = await CheckOrder.get();
      return data;
    } catch (err) {
      console.log(err);
    }
  },
}


