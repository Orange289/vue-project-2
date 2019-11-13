import moment from 'moment';
import jstz from 'jstimezonedetect';
import DateTime from 'luxon/src/datetime.js';
import Settings from 'luxon/src/settings.js';
import vue from './../../App';


export const TimeHelpers = {
  serverTz: 'Europe/Copenhagen',
  currTz: jstz.determine() || 'UTC',

  setCurrentTz() {
    vue.store.commit('setTimeZone', this.currTz.name());
    Settings.defaultZoneName = this.serverTz;
  },

  localizeDateTime(d) {
    Settings.defaultZoneName = this.serverTz;
    return (DateTime.fromISO(d.replace(' ', 'T'))).setZone(this.currTz.name());
  },

  getDate(d) {
    return (DateTime.fromISO(d.replace(' ', 'T'))).toFormat('d');
  },

  getMonth(d) {
    return (DateTime.fromISO(d.replace(' ', 'T'))).toFormat('LL');
  },

  getYear(d) {
    return (DateTime.fromISO(d.replace(' ', 'T'))).toFormat('y');
  },

  formatServerDate(d) {
    return d.split('/').reverse().join('-');
  },

  formatServerDateTime(d, t) {
    return moment(d.split('/').reverse().join('-') + ' ' + t).format('YYYY-MM-DD HH:mm');
  },

  getPreviousDate(d) {
    return moment(d).subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm');
  },

  setServerDateTime(d) {
    Settings.defaultZoneName = this.currTz.name();
    return ((DateTime.fromISO(d.replace(' ', 'T'))).setZone(this.serverTz).toFormat('yyyy-MM-dd HH:mm'));
  },

  isToday() {
    let today = moment(new Date()).format('YYYY-MM-DD');
    if (this.formatServerDate(vue.store.state.date) === today) {
      return true;
    }
  },

  setActiveTime() {
    setTimeout(function () {
      document.querySelectorAll('.record__time-item').forEach(function (el) {
        el.classList.remove('active');
      });
      if (document.querySelector(`[data-time="${vue.store.state.time}"]`)) {
        document.querySelector(`[data-time="${vue.store.state.time}"]`).classList.add('active');
      }
    }, 1);
  },

  countHoursDuration(s, e) {
    let start = moment(s, 'DD/MM/YYYY HH:mm:ss');
    let end = moment(e, 'DD/MM/YYYY HH:mm:ss');
    let duration = moment.duration(end.diff(start));
    return parseInt(duration.asHours());
  },

  countDaysDuration(s, e) {
    let start = moment(s, 'DD/MM/YYYY HH:mm:ss');
    let end = moment(e, 'DD/MM/YYYY HH:mm:ss');
    let duration = moment.duration(end.diff(start));
    return parseInt(duration.asDays());
  },

  countTimeLeft(s, e) {
    let end = moment(e, 'DD/MM/YYYY HH:mm:ss');
    let duration = end.diff(s);
    let left = moment.duration(duration);
    let result = Math.floor(left.asHours()) + moment.utc(duration).format(":mm:ss");
    return result;
  },

  compareWithToday(d) {
    if (moment(d.split(' ')[0].split('/').reverse().join('-') + ' ' + d.split(' ')[1])
      .isBefore(moment(new Date()).format('YYYY-MM-DD HH:mm'))) {
      return true;
    }
  },
}
