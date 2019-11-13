import datetime from './datetime-data';
import dates from './dates-data';
import times from './times-data';
import order from './create-order';
import checkOrder from './check-order';
import orders from './orders-data';

const repositories = {
  DateTime: datetime,
  Dates: dates,
  Times: times,
  Order: order,
  CheckOrder: checkOrder,
  Orders: orders
};

export const api = {
  getOrders: order => repositories[order],
  getDateTime: date => repositories[date],
  getDates: dates => repositories[dates],
  getTimes: times => repositories[times],
  createOrder: order => repositories[order],
  checkOrder: checkOrder => repositories[checkOrder],
};
