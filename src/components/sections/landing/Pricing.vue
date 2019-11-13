<template>
  <section class="pricing" id="prices">
    <container>
      <h2>Pricing</h2>
      <div class="pricing__preloader" v-if="loading"><img src="/assets/images/preloader.gif"></div>
      <div class="pricing__tabs" v-else>
        <div class="pricing__tabs-group">
          <b>Render</b>
          <tabs :items="renders" v-if="isClientsarea" @tabClick="onTabClick" />
          <tabs :items="renders" v-else/>
        </div>
        <div class="pricing__tabs-group">
          <b>Editor</b>
          <tabs :items="programs" v-if="isClientsarea" @tabClick="onTabClick"/>
          <tabs :items="programs" v-else/>
        </div>
        <div class="pricing__tabs-group">
          <b>Server</b>
          <tabs :items="servers" v-if="isClientsarea" @tabClick="onTabClick" />
          <tabs :items="servers" v-else />
        </div>
      </div>
      <div class="pricing__duration">
        <b>Duration</b>
        <div class="pricing__slider">
          <vue-slider
            ref="slider"
            v-model="sources.duration"
            :tooltip="'none'"
            :use-keyboard="true"
            :min="1"
            :max="72"
            :height="2"
            @change="onChangeSlider"
            :silent="true" />
        </div>
        <div class="pricing__slider-val">
          <input type="text"
                v-model="sources.duration"
                @input="onChangeInput"
                @keypress="onCheckInput($event)">
          <span>h</span>
        </div>
        <div class="pricing__error" v-show="sources.duration < 1">The value can't be less than 1</div>
        <div class="pricing__error" v-show="sources.duration > 72">The value can't be more than 72</div>
      </div>
      <div class="pricing__tariffs">
        <div class="prices__price active" v-multi-ref:tariff :data-price="getPriceForLess24" data-tariff="less24">
          <div class="prices__tariff">
            <div class="prices__hours">&lt; 24 h</div>
            <span class="hidden">per hour</span>
            <div class="prices__val">€{{ getPriceForLess24 }}</div>
          </div>
        </div>
        <div class="prices__price" v-multi-ref:tariff :data-price="getPriceForMore24" data-tariff="more24">
          <div class="prices__tariff" data-tariff="more24">
            <div class="prices__hours">&gt; 24 h</div>
            <span class="hidden">per hour</span>
            <div class="prices__val">€{{ getPriceForMore24 }}</div>
          </div>
        </div>
        <div class="prices__price" v-multi-ref:tariff :data-price="getPriceForMore72" data-tariff="more72">
          <div class="prices__tariff" data-tariff="more72">
            <div class="prices__hours">&gt; 72 h</div>
            <span class="hidden">per hour</span>
            <div class="prices__val">€{{ getPriceForMore72 }}</div>
          </div>
        </div>
      </div>
      <p class="pricing__note">
        If you want to rent render nodes for a longer than three&nbsp;days,
        <a href="#">contact us</a>.
      </p>
    </container>
    <Record :key="componentKey" />
  </section>
</template>

<script>
import Record from './Record.vue';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import axios from '../../../libs/axios';

import { Methods } from './../../../libs/api/methods';
import { CountHelpers } from './../../../libs/helpers/count';

export default {
  name: 'Pricing',
  components: {
    VueSlider,
    Record
  },
  data() {
    return {
      componentKey: 0,
      renders: {
        name: 'render',
        tabs: [],
        activeIndex: this.$store.state.rActiveIndex
      },
      programs: {
        name: 'program',
        tabs: [],
        activeIndex: this.$store.state.pActiveIndex
      },
      servers: {
        name: 'server',
        tabs: [],
        activeIndex: this.$store.state.sActiveIndex
      },
      sources: {
        duration: this.$store.state.duration
      },
      datetime: null,
      rendersData: 'api/renders/',
      programsData: 'api/editors/',
      serversData: 'api/rig-types/',
      nearestDateData: 'api/nearest-time/',
      loading: false
    }
  },
  mounted() {
    this.loading = true;
    this.getData();
    this.compareTariffs(this.sources.duration);
    this.$store.commit('setDuration', this.sources.duration);

    CountHelpers.countPrice(this.sources.duration, +this.$store.state.tariffs.currentTariff);
  },
  computed: {
    getPriceForLess24() {
      return this.$store.state.tariffs.less24;
    },
    getPriceForMore24() {
      return this.$store.state.tariffs.more24;
    },
    getPriceForMore72() {
      return this.$store.state.tariffs.more72;
    },
    isClientsarea() {
      return this.$route.name !== 'home';
    }
  },
  methods: {
    onTabClick() {
      this.forceRerender();
    },
    forceRerender() {
      this.componentKey += 1;
    },
    formatServerDateTime(d, t) {
      return d.split('/').reverse().join('-') + ' ' +  t;
    },
    setTariff(t, h) {
      let currentTariff;
      const activeClass = 'active';
      const hiddenClass = 'hidden';

      document.querySelector(`[data-tariff="${t}"]`).classList.add(activeClass);
      document.querySelector(`[data-tariff="${t}"] span`).classList.remove(hiddenClass);
      currentTariff = document.querySelector(`[data-tariff="${t}"]`).dataset.price;
      this.$store.commit('setCurrentTariff', currentTariff);
      CountHelpers.countPrice(h, currentTariff);
    },
    compareTariffs(v) {
      this.$nextTick(function() {
        let tariffs = document.querySelectorAll('.prices__price');
        let tariffsNotes = document.querySelectorAll('.prices__price span');
        const activeClass = 'active';
        const hiddenClass = 'hidden';

        tariffs.forEach((el) => {
          el.classList.remove(activeClass);
        })

        tariffsNotes.forEach((el) => {
          el.classList.add(hiddenClass);
        })

        if(v < 24) {
          this.setTariff('less24', v);
        } else if((v >= 24) && (v < 72)) {
          this.setTariff('more24', v);
        } else if(v == 72) {
          this.setTariff('more72', v);
        }
      })
    },
    changeSlider(v) {
      this.isDataChanged = true;
      this.$store.commit('setDuration', v);

      this.compareTariffs(v);
    },
    onChangeSlider(val) {
      this.changeSlider(val);
      this.getDateTime();
    },
    onChangeInput() {
      this.changeSlider(this.sources.duration);
      this.getDateTime();
    },
    onCheckInput($event) {
      if (($event.charCode === 0 || /\d/.test(String.fromCharCode($event.charCode)) || $event.keyCode === 8 || $event.keyCode === 46)) {
        return true;
      }
      else {
        $event.preventDefault();
      }
    },
    getData() {
      let _self = this;

      axios.all([
        axios.get(_self.rendersData),
        axios.get(_self.programsData),
        axios.get(_self.serversData)
      ])
      .then(axios.spread((firstResponse, secondResponse, thirdResponse) => {
        _self.loading = false;
        _self.getDataMethod(firstResponse, 'render');
        _self.getDataMethod(secondResponse, 'program');
        _self.getDataMethod(thirdResponse, 'server')
      }))
      .catch(error => console.log(error));
    },
    createSoftwareTabsArray (arr) {
      return arr.map(el => {
        return {
          id: el.id,
          title : el.name,
          value: el.name.toLowerCase().replace(/\s/g, '')
        }
      });
    },
    createServerTabsArray (arr) {
      return arr.map(el => {
        return {
          id: el.id,
          title : el.name,
          value: el.name.toLowerCase().replace(/\s/g, ''),
          price_less_24h: el.price_hour_less_24h,
          price_more_24h: el.price_hour_more_24h,
          price_more_72h: el.price_hour_more_72h
        }
      });
    },
    setActiveSource (sourceName, sourceIndex, tabs, mutation) {
      let source;

      if (sourceName === 'render') {
        source = {
          render: tabs[sourceIndex].id,
          rActiveIndex: sourceIndex
        }
      } else if (sourceName === 'program') {
        source = {
          program: tabs[sourceIndex].id,
          pActiveIndex: sourceIndex
        }
      } else if (sourceName === 'server') {
        source = {
          server: tabs[sourceIndex].id,
          sActiveIndex: sourceIndex
        }
      };

      this.$store.commit(mutation, source);

      this.$nextTick(function() {
        document.querySelector(`[data-value="${tabs[sourceIndex].value}"]`).classList.add('active');
      })
    },
    getDataMethod(response, type) {
      let _self = this;

      if (type === 'render') {
        _self.renders.tabs = _self.createSoftwareTabsArray(response.data);
        _self.setActiveSource('render', _self.renders.activeIndex, _self.renders.tabs, 'setRender');
      }
      else if (type === 'program') {
        _self.programs.tabs = _self.createSoftwareTabsArray(response.data);
        _self.setActiveSource('program', _self.programs.activeIndex, _self.programs.tabs, 'setProgram');
      }
      else if (type === 'server') {
        _self.servers.tabs = _self.createServerTabsArray(response.data);
        _self.setActiveSource('server', _self.servers.activeIndex, _self.servers.tabs, 'setServer');
        _self.$store.commit('setLess24', _self.servers.tabs[_self.servers.activeIndex].price_less_24h);
        _self.$store.commit('setMore24', _self.servers.tabs[_self.servers.activeIndex].price_more_24h);
        _self.$store.commit('setMore72', _self.servers.tabs[_self.servers.activeIndex].price_more_72h);

          // first loading of the tariffs

          if (!this.$store.state.tariffs.isTariffLoaded) {
            let currentTariff = _self.servers.tabs[_self.servers.activeIndex].price_less_24h;
            this.$store.commit('setCurrentTariff', currentTariff);
            this.$store.commit('setTariffLoaded');
            CountHelpers.countPrice(_self.$store.state.duration, currentTariff);
          }
      }
    },
    async getDateTime() {
      await Methods.getDateTimeData();
    },
  }
}
</script>

<style lang="scss">
.pricing {
  color: #fff;
  background: $gray-dark-color;
  padding-top: 45px;
  padding-bottom: 170px;
  position: relative;

  b {
    font-size: 20px;
    color: $gray-color;
    min-width: 110px;
    margin-right: 28px;
  }

  h2 {
    margin-bottom: 48px;
    display: inline-block;
  }

  @include bp(desktop) {
    padding-top: 82px;
    padding-bottom: 100px;

    h2 {
      margin-bottom: 27px;
    }

    b {
      font-size: 23px;
      min-width: 126px;
      margin-right: 38px;
    }
  }
}

body.opened-record .pricing,
body.opened-record .pricing b {
  color: rgba(255,255,255,0);
}

.pricing__tabs-group {
  margin-bottom: 48px;
  display: flex;
  align-items: flex-end;

  @include bp(desktop) {
    align-items: center;
  }
}

.pricing__duration {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 504px;
  margin-bottom: 42px;
  position: relative;

  @include bp(desktop) {
    max-width: 534px;

    b {
      min-width: 110px;
      margin-right: 48px;
    }
  }

  @include bp(desktop--big) {
    .landing & {
      max-width: 708px;

      b {
        min-width: 108px;
      }
    }
  }
}

.pricing__slider {
  width: 302px;

  @include bp(desktop--big) {
    .landing & {
      width: 440px;
    }
  }

  // Vue-slider override

  .vue-slider {
    height: 2px;
  }

  .vue-slider-rail,
  .vue-slider:hover .vue-slider-rail {
    background: $gray-color;
    border-radius: 0;
  }

  .vue-slider-process,
  .vue-slider:hover .vue-slider-process {
    background: $blue-color;
  }

  .vue-slider-dot-handle-focus,
  .vue-slider-dot-handle {
    box-shadow: none;
    border: none;
    max-width: 22px;
    transition: none;
  }

  .vue-slider-dot-handle,
  .vue-slider-dot-handle-focus {
    background: none;
    @include prlgrm(175deg, $blue-color);
  }

  .vue-slider-dot {
    width: 30px !important;
    height: 30px !important;
  }
}

.pricing__slider-val {
  width: 58px;
  margin-left: 10px;

  input {
    font-size: 30px;
    letter-spacing: .9;
    color: $blue-color;
    text-align: right;
    width: 40px;
    background: transparent;
    border: none;
    border-bottom: 1px solid #fff;
    box-shadow: none;

    &:focus {
      outline: none;
    }
  }

  span {
    color: #fff;
    font-size: 16px;
  }
}

.pricing__tariffs {
  margin-left: -23px;
  margin-bottom: 20px;
}

.prices__price {
  padding: 17px 23px;
  z-index: 1;
  cursor: default;

  span {
    opacity: .3;
    font-weight: 600;
    letter-spacing: .48px;
    text-transform: uppercase;
  }

  &.active {
    @include prlgrm(170deg, $gray-color);
  }
}

.prices__tariff {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 486px;

  @include bp(desktop--big) {
    .landing & {
      width: 688px;
    }
  }
}

.prices__hours {
  font-size: 23px;
  letter-spacing: .69px;
  font-weight: bold;
}

.prices__val {
  font-family: $font-secondary;
  font-size: 30px;
  letter-spacing: .9px;
}

.pricing__error {
  color: #fff;
  position: absolute;
  left: 35%;
  bottom: -22px;
}

.pricing__note {
  max-width: 470px;
}

.pricing__preloader {
  display: inline-block;
  margin-left: 30px;

  .clientsarea & {
    margin-left: 0;
    margin-bottom: 30px;
  }
}
</style>
