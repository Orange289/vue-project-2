<template>
  <date-pick v-model="selectedDate"
    class="calendar"
    :hasInputElement="false"
    :format="format"
    :isDateDisabled="setDatesDisabled"
    @input="onChange">
  </date-pick>
</template>
<script>

import DatePick from 'vue-date-pick';

export default {
  name: 'calendar',
  props: {
    date: String,
    changeMethod: {type: Function},
    setDatesDisabled: {type: Function}
  },
  components: {
    DatePick
  },
  data () {
    return {
      selectedDate: this.date,
      format: 'DD/MM/YYYY'
    }
  },
  mounted () {
  },
  methods: {
    onChange () {
      this.$store.commit('setDate', this.selectedDate);
      this.changeMethod();
    }
  }
}
</script>

<style lang="scss">
@import 'vue-date-pick/src/vueDatePick.scss';

.calendar {
  font-family: $font-primary;
  margin-left: -64px;
}

// Calendar

.vdpPeriodControl>select {
  cursor: default;
}

.vdpPeriodControl>select option {
  display: none !important;
}

.vdpInnerWrap,
.vdpHeader {
  background: transparent;
}

.vdpHeader {
  display: flex;
}

.vdpInnerWrap {
  box-shadow: none;
  border: none;
}

.vdpPeriodControls {
  text-align: left;
  padding-left: 44px;
  margin-right: 35px;
  width: 280px;

  button {
    font-family: $font-primary;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    padding: 0;
    margin-bottom: 24px;
  }

  @include bp(desktop--big) {
    .landing & {
      width: 380px;

      button {
        font-size: 38px;
        margin-bottom: 45px;
      }
    }
  }
}

.vdpPeriodControl {
  & + & {
    margin-left: 10px;
  }
}

.vdpArrowPrev {
  @include arrow(16px, 16px, $blue-color, true);
  order: 1;

  &[disabled] {
    @include arrow(16px, 16px, rgba($blue-color, .3), true);
    cursor: default;
  }
}

.vdpArrowNext {
  @include arrow(16px, 16px, $blue-color);
  order: 2;
}

.vdpArrow {
  border-bottom-width: 3px;
  border-left-width: 3px;
  border-top: 0;
  position: static;
  margin-top: 8px;

  &:after {
    display: none;
  }

  @include bp(desktop--big) {
    .landing & {
      margin-top: 16px;
    }
  }
}

.vdpHeadCellContent {
  font-family: $font-primary;
  text-transform: uppercase;
  color: rgba(#fff, .5);

  @include bp(desktop--big) {
    .landing & {
      font-size: 23px;
    }
  }
}

.vdpCellContent {
  color: $blue-color;
  cursor: pointer;
  margin-bottom: 20px;
  width: 50px;
  line-height: 40px;
  height: 40px;

  @include bp(desktop--big) {
    .landing & {
      font-size: 23px;
      width: 76px;
      line-height: 70px;
      height: 70px;
    }
  }
}

.vdpCell.selected .vdpCellContent {
  color: $violet-color;
  font-weight: 600;
  border-radius: 0;
  background: none;
  @include prlgrm(170deg, $blue-color);
}

.vdpCell.selectable:hover .vdpCellContent {
  background: none;
  color: $violet-color;
}

.vdpCell.selectable:not(.selected):hover .vdpCellContent {
  color: rgba($blue-color, .8);
}

.vdpCell.disabled .vdpCellContent {
  cursor: default;
}


// hack :(

.vdpCell.disabled.today {
  opacity: 1 !important;
}

</style>
