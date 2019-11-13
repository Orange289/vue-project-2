<template>
  <div class="tabs">
    <div
      v-for="(item, index) in items.tabs"
      :class="['tabs__item', `tabs__item--${items.name}`, {'disabled': item.isDisabled}]"
      @click="onTabClick"
      :key="index"
      :data-value="item.value"
      :data-id="item.id"
      :data-less-24="item.price_less_24h"
      :data-more-24="item.price_more_24h"
      :data-more-72="item.price_more_72h"
      :data-type="items.name">
      {{ item.title }}
    </div>
  </div>
</template>

<script>
import { Methods } from './../../libs/api/methods';
import { CountHelpers } from '../../libs/helpers/count';

export default {
  name: 'Tabs',
  props: {
    items: {
      type: Object
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active_index: 0,
      datetime: this.$store.state.datetime,
      duration: this.$store.state.duration,
    }
  },
  methods: {
    getSiblings (elem) {
      let siblings = [];
      let sibling = elem.parentNode.firstChild;
      let skipMe = elem;
      for ( ; sibling; sibling = sibling.nextSibling )
        if ( sibling.nodeType == 1 && sibling != elem )
            siblings.push( sibling );
      return siblings;
    },
    async getDateTime() {
      await Methods.getDateTimeData();
    },
    onTabClick(e) {
      const activeClass = 'active';
      let _self = this;
      let tabId = e.target.getAttribute('data-id');
      let tabValue = e.target.getAttribute('data-value');
      let tabLess24Val = e.target.getAttribute('data-less-24');
      let tabMore24Val = e.target.getAttribute('data-more-24');
      let tabMore72Val = e.target.getAttribute('data-more-72');
      let tabType = e.target.dataset.type ? e.target.dataset.type : null;
      let duration = this.$store.state.duration;

      this.$emit('tabClick');

      if(!e.target.classList.contains('disabled')) {
        this.getSiblings(e.target).forEach(function(el) {
          if (el.classList.contains(activeClass)) {
            el.classList.remove(activeClass);
          }
        });

        this.active_index = [...e.target.parentElement.children].indexOf(e.target);

        e.target.classList.add(activeClass);

        let setServerParams = function() {
          _self.$store.commit('setServer', {
              server: tabId,
              sActiveIndex: _self.active_index
          });
          _self.$store.commit('setLess24', tabLess24Val);
          _self.$store.commit('setMore24', tabMore24Val);
          _self.$store.commit('setMore72', tabMore72Val);

          _self.$nextTick(function() {
            let tariff = document.querySelector('.prices__price.active').dataset.price;
            _self.$store.commit('setCurrentTariff', tariff);

            CountHelpers.countPrice(duration, tariff);
          })
        };

        switch(tabType) {
          case 'render': _self.$store.commit('setRender', {
            render: tabId,
            rActiveIndex: _self.active_index
          });
          break;
          case 'program': _self.$store.commit('setProgram', {
            program: tabId,
            pActiveIndex: _self.active_index
          });
          break;
          case 'server': {
            setServerParams();
          };
          break;
          case 'service': _self.$store.commit('setMultiservice', {
            service: tabValue,
            mActiveIndex: _self.active_index,
            id: tabId
          });
          break;
        }

        _self.$nextTick(function() {
          if (!document.querySelector('.multiservice')) {
            _self.getDateTime();
          }
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
}

.tabs__item {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  margin-right: 34px;
  z-index: 1;

  &.disabled {
    opacity: .6;
    cursor: default;
  }

  &.active {
    color: $blue-color;
  }

  @include bp(desktop) {
    padding: 20px 34px;
    margin-right: -2px;
    min-width: 165px;
    text-align: center;
    @include prlgrm(170deg, $blue-color, true);

    span {
      z-index: 1;
      position: relative;
    }

    &.active {
      @include prlgrm(170deg, $blue-color);
      color: $violet-color;
    }
  }
}
</style>
