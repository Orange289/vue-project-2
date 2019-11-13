<template>
  <section :class="['record', {'record--opened' : isRecordOpen}]">
    <div class="record__back" v-show="isRecordOpen" @click="onBackClick"></div>
    <div class="record__container">
      <div class="record__intro">
        <h2 v-if="isHomePage">Projected Price</h2>
        <h2 v-else>Price</h2>
        <div class="record__price">€{{ price }}</div>
        <div class="record__option record__option--time">
          <b>Start time</b>
          <span id="recordDate"
            ref="recordDate"
            :class="{'clickable': !isDateOpen }"
            @click="openCalendar">
            {{ selectedDate }}
          </span>
          <span id="recordTime"
            ref="recordTime"
            :class="{'clickable': isDateOpen }"
            @click="openTime">
            {{ selectedTime }}
          </span>
          <p class="error-note" v-if="isBadRequestError">Start time is incorrect!</p>
        </div>
        <div class="record__option record__option--duration" v-show="isRecordOpen">
          <b>Duration</b>
          <span>{{ duration }}</span>
        </div>
        <btn class="record__btn"
          :disabled="duration > 72 || duration == 0"
          :btnAction="onBuyClick">
          Buy
        </btn>
        <p class="error-note" v-if="isBadRequestError">Bad request to the server!<br>Try to change the start time!</p>
        <p class="error-note" v-if="isTimeOccupiedError">No free rigs found!<br>Try to change the parameters!</p>
        <p class="record__note">
          Six Nines take money for rendering
          time only, not for <span>preparation</span>.
        </p>
      </div>
      <div class="record__content" v-show="isRecordOpen">
        <div class="record__date" v-show="isDateOpen">
          <calendar :date="selectedDate" ref="calendar" :changeMethod="openTime" :setDatesDisabled="setDatesDisabled"  />
          <a class="record__btn record__btn--totime" @click="openTime">Choose time</a>
        </div>
        <div class="record__time" v-show="isTimeOpen">
          <!-- <div class="record__date-title">
            {{ selDate }}
          </div> -->
          <ul class="record__time-items">
            <li v-for="(item, index) in times"
              ref="recordTimeItem"
              :key="index"
              class="record__time-item"
              @click="setTime($event)"
              :data-time="item">
                {{ item }}
            </li>
          </ul>
          <a class="record__btn record__btn--backtodate" @click="onBackClick">Back to date</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import calendar from './../../general/Calendar.vue';
import axios from './../../../libs/axios';
import moment from 'moment';

import { Methods } from './../../../libs/api/methods';
import { TimeHelpers } from './../../../libs/helpers/time';

export default {
  name: 'Record',
  components: {
    calendar
  },
  data() {
    return {
      isRecordOpen: false,
      isDateOpen: false,
      isTimeOpen: false,
      times: [''],
      dates: [],
      order: null,
      datetime: this.$store.state.datetime,
      findMonthData: 'api/find-month/',
      responseStatus: null
    }
  },
  computed: {
    selectedDate() {
      return this.$store.state.date;
    },
    selectedTime() {
      return this.$store.state.time;
    },
    selDateTime() {
      return this.$store.state.datetime;
    },
    price() {
      return this.setRounding(this.$store.state.price);
    },
    duration() {
      return this.$store.state.duration;
    },
    isBadRequestError() {
      return this.$store.state.errors.isBadRequestError;
    },
    isTimeOccupiedError() {
      return this.$store.state.errors.isTimeOccupiedError;
    },
    isHomePage() {
      return this.$route.name === 'home';
    }
  },
  mounted() {
    if (!this.isHomePage) {
      this.openCalendar();
    } else {
      this.getDateTime();
    }

    this.$store.commit('resetBadRequestError');
    this.$store.commit('resetTimeOccupiedError');

    this.$nextTick(function() {
      this.disablePreviousMonth();
    })

    this.onChangeMonth();
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
  },
  methods: {
    setRounding(num) {
      return Math.round(num * 100) / 100;
    },
    async getDateTime() {
      if (!this.$store.state.isNearestFound) {
        await Methods.getDateTimeData();
      } else {
        this.$store.commit('setDate', this.$store.state.date);
        this.$store.commit('setTime', this.$store.state.time);
        this.datetime = TimeHelpers.setServerDateTime(TimeHelpers.formatServerDateTime(this.$store.state.date, this.$store.state.time));
        this.$store.commit('setDateTime', this.datetime);
      }
    },
    async getDates () {
      const data = await Methods.getDates();
      this.dates = [...data];
    },
    async getOrders () {
      const data = await Methods.getOrders();
    },
    async getTimes () {
      const data = await Methods.getTimes();
      this.times = [...data];
    },
    async checkOrder() {
      try {
        await Methods.checkOrder();
      } catch(err) {
        console.log(err);
      }
    },
    openCalendar() {
      this.isRecordOpen = true;
      this.isDateOpen = true;
      this.isTimeOpen = false;
      document.body.classList.add('opened-record');

      this.getDates();
    },
    openTime() {
      let _self = this;

      _self.isDateOpen = false;
      _self.isTimeOpen = true;

      _self.getTimes();

      _self.datetime = TimeHelpers.setServerDateTime(TimeHelpers.formatServerDateTime(_self.$store.state.date, _self.$store.state.time));
      _self.$store.commit('setDateTime', _self.datetime);
    },
    setTime($event) {
      this.$store.commit('resetBadRequestError');
      this.$store.commit('resetTimeOccupiedError');

      this.$refs.recordTimeItem.forEach(function(el) {
        el.classList.remove('active');
      })
      this.$store.commit('setTime', $event.target.dataset.time);
      this.datetime = TimeHelpers.setServerDateTime(TimeHelpers.formatServerDateTime(this.$store.state.date, this.$store.state.time));
      this.$store.commit('setDateTime', this.datetime);
      $event.target.classList.add('active');
    },
    onBackClick() {
      if (this.isDateOpen) {
        this.isDateOpen = false;
        this.isTimeOpen = false;
        this.isRecordOpen = false;
        document.body.classList.remove('opened-record');
      } else {
        this.isTimeOpen = false;
        this.isDateOpen = true;
      }
    },
    onBuyClick() {
      this.checkOrder();
    },
    disablePreviousMonth() {
      if (document.querySelector('.today:not(.outOfRange)')) {
        document.querySelector('.vdpArrowPrev').setAttribute('disabled', 'disabled');
      } else {
        document.querySelector('.vdpArrowPrev').removeAttribute('disabled');
      }
    },
    onDocumentClick(e) {
      let _self = this;

      this.$nextTick(function() {
        if (e.target.classList.contains('vdpArrow')) {

          this.disablePreviousMonth();

          let mon = document.querySelector('.vdpPeriodControl:first-child button').innerHTML.trim();
          let year = document.querySelector('.vdpPeriodControl:nth-child(2) button').innerHTML;

          let nearestDay = TimeHelpers.getDate(_self.datetime);
          let nearestMonth = TimeHelpers.getMonth(_self.datetime) + 1;
          let nearestYear = TimeHelpers.getYear(_self.datetime);

          let dates = [];
          let beginTime = moment(`${nearestDay} ${mon} ${year}`).format('YYYY-MM-DD') + ' ' + '23:00';

          axios.post(_self.findMonthData, {
            render: _self.$store.state.render,
            editor: _self.$store.state.program,
            rig_type: _self.$store.state.server,
            duration: _self.$store.state.duration,
            begin_time: beginTime
          })
          .then(response => {
            if(response.status === 200) {
              response.data.forEach((el, index) => {
                dates.push(el);
              });
              _self.dates = dates.map((val) => {
                return moment(`${val}/${mon}/${nearestYear}`).format('DD/M/YYYY');
              });
            };
          })
        }
      })
    },
    onChangeMonth() {
      document.addEventListener('click', this.onDocumentClick);
    },
    setDatesDisabled (date) {
      let currentDate = new Date();
      let formattedDate = moment(date).format('DD/M/YYYY');

      if ((formattedDate !== moment(currentDate).format('DD/M/YYYY'))
        && (!this.dates.includes(formattedDate))) {
        return date;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.record {
  color: #fff;
  top: -58px;
  right: 0;
  padding-top: 177px;
  padding-left: 72px;
  height: calc(100% + 58px);
  z-index: 10;
  width: 417px;
  @include prlgrm(170deg, $violet-color);
  position: absolute;

  .landing & {
    transition: width .2s;
  }

  h2 {
    margin-bottom: 34px;
  }

  b {
    color: rgba(#fff, .3) !important;
    font-size: 20px;
    font-weight: bold;
    display: block;
    margin-bottom: 28px;
  }

  &:before {
    right: 100px;
  }

  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 50%;
    height: 100%;
    background: $violet-color;
    z-index: -1;
  }

  @include bp(0 tablet) {
    width: 424px;
  }

  @include bp(desktop) {
    width: 430px;
    padding-left: 82px;
  }

  @include bp(desktop--big) {
    .landing & {
      top: -106px;
      height: calc(100% + 106px);
      width: 784px;
      padding-left: 102px;

      h2 {
        margin-bottom: 22px;
      }

      b {
        font-size: 23px;
        margin-bottom: 23px;
      }
    }

  }
}

.record.record--opened {
  width: 100%;

  .record__container {
    display: flex;
  }
}

.record__price {
  font-family: $font-secondary;
  font-size: 70px;
  color: $pink-color;
  margin-bottom: 60px;

  @include bp(desktop--big) {
    font-size: 78px;
    margin-bottom: 45px;
  }
}

.record__option {
  span {
    color: $blue-color;
    font-size: 30px;
    font-family: $font-secondary;
    cursor: default;

    &.clickable {
      cursor: pointer;
    }

    &.clickable:hover {
      opacity: .8;
    }
  }

  @include bp(desktop--big) {
    span {
      font-size: 38px;
    }
  }
}

.record__option--duration {
  margin-top: 55px;

  span {
    &:after {
      content: 'h';
      font-size: 16px;
      margin-left: 6px;
    }
  }
}

.record__btn {
  margin-top: 60px;
  margin-bottom: 49px;
  margin-left: 0;
  padding-left: 60px;
  padding-right: 60px;
}

.record__btn--backtodate,
.record__btn--totime {
  @include btn();
  max-width: 200px;
  margin-left: 0;
  position: absolute;
  bottom: 0;
}

.landing .record__btn--totime,
.landing .record__btn--backtodate {
  @include bp(desktop--big) {
    bottom: -60px;
  }
}

.record__note {
  max-width: 268px;

  span {
    color: $blue-color;
  }
}

.record__back {
  @include arrow(30px, 30px, $blue-color, true);
  margin-bottom: 36px;
  margin-left: 10px;
}

.record__content {
  flex: 1;
  margin-left: 100px;

  @include bp(desktop) {
    margin-left: 200px;
  }
}

.record__date-title {
  color: $blue-color;
  font-size: 24px;
  font-weight: bold;
  padding: 0;
  margin-bottom: 56px;
  width: 100%;

  @include bp(desktop--big) {
    font-size: 38px;
    margin-bottom: 112px;
  }
}

.record__time-items {
  display: flex;
  flex-wrap: wrap;
  margin-left: -25px;
  width: 100%;
  max-width: 900px;
}

.record__time-item {
  font-size: 16px;
  color: $blue-color;
  cursor: pointer;
  z-index: 1;
  padding: 10px 28px;
  margin-bottom: 40px;
  margin-right: 40px;
  width: 97px;
  text-align: center;

  &.active {
    cursor: default;
    color: $violet-color;
    font-weight: bold;
    @include prlgrm(170deg, $blue-color);
  }

  @include bp(desktop--big) {
    .landing & {
      font-size: 23px;
      padding: 17px 35px;
      width: 127px;
    }
  }
}

.record__time,
.record__date {
  position: relative;
  min-height: 586px;

  @include bp(tablet) {
    min-height: 604px;
  }
  @include bp(desktop--big) {
    min-height: 618px;
  }
}
</style>
