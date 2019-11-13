<template>
  <div class="new-order">
    <div class="internal__tabs">
      <h2 class="internal__tab" @click="onCurrentOrdersClick">Current orders</h2>
      <h2 class="internal__tab internal__tab--active" >Make new order</h2>
    </div>
    <div class="new-order__content">
      <Pricing />
    </div>
  </div>
</template>

<script>
import Pricing from './../landing/Pricing';


export default {
  name: 'newOrder',
  components: {
    Pricing
  },
  methods: {
    onCurrentOrdersClick() {
      this.$store.commit('setOrdersPage');
      document.body.classList.remove('neworder');
    }
  },
}
</script>

<style lang="scss">
.new-order {
  .pricing {
    background: transparent;
    padding-top: 0;

    b {
      font-size: 15px;
      min-width: 40px;
      color: rgba($gray-dark-color, .2);
      letter-spacing: .45px;
    }

    body.opened-record &,
    body.opened-record & b {
      color: rgba($gray-dark-color, .2);
    }

    .container > h2 {
      display: none;
    }

    .container {
      display: block;
      padding: 0;
      width: 50%;
      margin-left: 0;
      margin-bottom: 200px;
      z-index: 1;
    }
  }

  .pricing__error {
    color: $gray-dark-color;
  }

  .tabs__item {
    font-size: 12px;
    min-width: 107px;
    padding: 14px 20px;
    color: #6a7074;

    &.active {
      color: #fff;
    }
  }

  .pricing__tabs-group {
    margin-bottom: 24px;
  }

  .pricing__duration {
    flex-wrap: wrap;

    b {
      font-size: 15px;
      width: 100%;
      letter-spacing: .45px;
      margin-bottom: 25px;
    }
  }

  .pricing__slider {
    width: 85%;
  }

  .pricing__slider .vue-slider-rail,
  .pricing__slider .vue-slider:hover .vue-slider-rail {
    background: #d4d6d7;
  }

  .pricing__slider-val input {
    color: $gray-dark-color;
    font-size: 20px;
    font-weight: 400;
    border-bottom: 2px solid #d4d6d7;
    padding-bottom: 10px;
  }

  .pricing__slider-val span {
    font-size: 15px;
    color: $gray-dark-color;
  }

  .pricing__note,
  .record__note {
    display: none;
  }

  .prices__price.active:before {
    background-color: $gray-lightest-color !important;
  }

  .prices__hours,
  .prices__val {
    font-size: 15px;
  }

  .prices__hours,
  .prices__val {
    color: $gray-dark-color;
  }

  .record__option--time {
    display: none;
  }

  .record{
    &:before,
    &:after {
      display: none;
    }

    &--opened {
      padding-top: 0;
      width: 100%;
      padding-left: 0;
      margin-top: 40px;
      z-index: 0;
    }
  }

  .record__back {
    display: none;
  }

  .record__container {
    flex-wrap: wrap;
  }

  .record__intro {
    width: 100%;
    order: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 64px;
    padding-bottom: 75px;
    margin-top: 103px;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: -100px;
      width: 10000px;
      height: 100%;
      background: $gray-lightest-color;
      z-index: -1;
    }

    h2 {
      color: $violet-color;
      margin-bottom: 0;
    }

    .record__btn {
      margin-top: 0;
      margin-bottom: 0;
      margin-right: 320px;
    }
  }

  .record__price {
    font-size: 40px;
    margin-bottom: 0;
  }

  .record__content {
    margin-left: 0;
  }

  .calendar {
    margin-left: 0;
  }

  .vdpPeriodControls button,
  .vdpHeadCellContent {
    color: $gray-dark-color;
  }

  .vdpPeriodControls {
    padding-left: 20px;
  }

  .vdpCellContent,
  .vdpCell.selected .vdpCellContent {
    color: $gray-dark-color;
  }

  .record__date,
  .record__time {
    min-height: 518px;
    width: 50%;
    margin-right: 0;
    margin-left: auto;
  }

  .record__btn {
    color: $blue-color;
    margin-left: 34px;
  }

  .record__btn--totime {
    bottom: -60px;
  }

  .record__time-items {
    margin-left: 20px;
  }

  .record__time-item {
    color: $gray-dark-color;
    width: 80px;
    margin-bottom: 20px;
    margin-right: 20px;
    padding: 10px;

    &.active {
      color: $gray-dark-color;
    }
  }

  .record__option--duration {
    display: none;
  }

  .error-note {
    color: $gray-dark-color;
    width: 100%;
    position: absolute;
    bottom: 0;
  }

  @include bp(0 desktop) {
    .prices__tariff {
      width: 432px;
    }

    .tabs__item {
      padding: 0;
      min-width: 70px;
      width: 70px;
    }

    .tabs__item.active {
      color: $blue-color;
    }

    .pricing b {
      width: 60px;
    }
  }

}
</style>
