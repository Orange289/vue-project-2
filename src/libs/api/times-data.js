import axios from '../axios';
import vue from './../../App';

import { TimeHelpers } from './../helpers/time';

const resource = 'api/find-day/';

export default {
  get (payload) {
    let times = [];
    let timesConverted = [];
    let beginTime = TimeHelpers.setServerDateTime(TimeHelpers.formatServerDateTime(vue.store.state.date, '23:00'));

    return axios.post(resource, {
      render: vue.store.state.render,
      editor: vue.store.state.program,
      rig_type: vue.store.state.server,
      duration: vue.store.state.duration,
      begin_time: beginTime
    }, payload)
      .then(response => {
        if (response.status === 200) {
          response.data.forEach((el) => {
            times.push(el);
          });

          let getServerDate = TimeHelpers.formatServerDate(vue.store.state.date);
          let lastIndex;

          timesConverted = times.map((val) => {
            if (val < 10) {
              return TimeHelpers.localizeDateTime(`${getServerDate} 0${val}:00`).toFormat('H:mm');
            } else {
              return TimeHelpers.localizeDateTime(`${getServerDate} ${val}:00`).toFormat('H:mm');
            }
          });

          timesConverted.forEach((el,index) => {
            if (el === '23:00') {
              lastIndex = index;
            }
          });

          timesConverted.splice(lastIndex + 1);
          TimeHelpers.setActiveTime();

          if (TimeHelpers.isToday()) {
            return timesConverted;
          } else {
            // Check time slots for the previous date (due to possible time difference)
            let beginTimePrevious = TimeHelpers.getPreviousDate(beginTime);
            let timesPrevious = [];
            let timesConvertedPrevious = [];
            let timesNext = [];
            let zeroIndex;

            return axios.post(resource, {
              render: vue.store.state.render,
              editor: vue.store.state.program,
              rig_type: vue.store.state.server,
              duration: vue.store.state.duration,
              begin_time: beginTimePrevious
            })
              .then(response => {
                if (response.status === 200) {
                  response.data.forEach((el) => {
                    timesPrevious.push(el);
                  });

                  timesConvertedPrevious = timesPrevious.map((val) => {
                    if (val < 10) {
                      return TimeHelpers.localizeDateTime(`${getServerDate} 0${val}:00`).toFormat('H:mm');
                    } else {
                      return TimeHelpers.localizeDateTime(`${getServerDate} ${val}:00`).toFormat('H:mm');
                    }
                  });

                  timesConvertedPrevious.forEach((el, index) => {
                    if (el === '0:00') {
                      zeroIndex = index;
                    }
                  });

                  for (let i = zeroIndex; i < timesConvertedPrevious.length; i++) {
                    timesNext.push(timesConvertedPrevious[i]);
                  }
                  TimeHelpers.setActiveTime();

                  return [...timesNext, ...timesConverted];
                }
              })
          }
        }
      });
  }
}
