<template>
  <div class="multiservice__form">
    <multiContainer>
      <form
        class="form form--multiservice"
        :action="action"
        @submit.prevent="submit">
        <div class="form__fields multiservice__form-parameters" v-if="isParameters">
          <div class="field form__field">
            <label class="field__label" for="services">Please select one of the following services:</label>
            <tabs :items="services"/>
          </div>
          <div class="field form__field">
            <label class="field__label">
              Please select amount of Nodes You would like to book:
            </label>

            <div class="form-group" v-if="isRendering"
              :class="{'form-group--error': $v.renderingAmount.$error}">
              <input class="field__input field__input--amount"
                v-model.trim.lazy="$v.renderingAmount.$model"
                @keypress="onCheckInput($event)"
                @input="onChangeAmount($event)"/>
              <div class="error" v-if="!$v.renderingAmount.between">
                Must be between {{$v.renderingAmount.$params.between.min}}  and
                {{$v.renderingAmount.$params.between.max}}
              </div>
              <div class="error" v-if="!$v.renderingAmount.required">Must be filled</div>
            </div>

            <div class="form-group" v-if="isDL"
              :class="{ 'form-group--error': $v.dlAmount.$error }">
              <input class="field__input field__input--amount"
                v-model.trim.lazy="$v.dlAmount.$model"
                @keypress="onCheckInput($event)"
                @input="onChangeAmount($event)"/>
              <div class="error" v-if="!$v.dlAmount.between">
                Must be between {{$v.dlAmount.$params.between.min}}  and
                {{$v.dlAmount.$params.between.max}}
              </div>
              <div class="error" v-if="!$v.dlAmount.required">Must be filled</div>
            </div>

            <div class="form-group" v-if="isPassword"
              :class="{ 'form-group--error': $v.passwordAmount.$error }">
              <input  class="field__input field__input--amount"
                v-model.trim.lazy="$v.passwordAmount.$model"
                @keypress="onCheckInput($event)"
                @input="onChangeAmount($event)"/>
              <div class="error" v-if="!$v.passwordAmount.between">
                Must be between {{$v.passwordAmount.$params.between.min}}  and
                {{$v.passwordAmount.$params.between.max}}
              </div>
              <div class="error" v-if="!$v.passwordAmount.required">Must be filled</div>
            </div>
          </div>
          <div class="field field--duration">
            <label class="field__label">Please select duration:</label>
            <div class="multiservice__slider">
              <vue-slider
                ref="slider"
                v-model="duration"
                :tooltip="'none'"
                :use-keyboard="true"
                :min="1"
                :max="750"
                :height="2"
                @change="onChangeSlider"
                :silent="true" />
            </div>
            <div class="multiservice__slider-val">
              <input type="text"
                v-model="duration"
                @input="onChangeInput"
                @keypress="onCheckInput($event)">
              <span>h</span>
            </div>
            <div class="error" v-if="duration < 1">The value can't be less than 1</div>
            <div class="error" v-if="duration > 750">The value can't be more than 750</div>
          </div>

          <button class="sixnines-btn multiservice__btn multiservice__btn--back"
            @click="onConfirmClick">
            Confirm
          </button>
        </div>
        <div class="form__fields multiservice__form-contacts" v-else-if="isContacts">
          <div class="field form__field">
            <label class="field__label">Please fill the contact data of your company:</label>
            <div :class="['form-group', { 'form-group--error': $v.email.$error }]">
              <label class="field__label" for="email">
                <input :class="['field__input', {'changed': email!=='' }]" id="email"
                  @input="onEmailChange($event)"
                  v-model.trim="$v.email.$model"/>
                <span class="field__floating-label">Email</span>
                <div class="error" v-if="!$v.email.required">Field is required</div>
                <div class="error" v-if="!$v.email.email">Please enter email</div>
              </label>
            </div>
            <div :class="['form-group', { 'form-group--error': $v.phone.$error }]">
              <label class="field__label" for="phone">
                <input :class="['field__input', {'changed': phone!=='' }]" id="phone"
                  @input="onPhoneChange($event)"
                  v-model.trim="$v.phone.$model"/>
                <span class="field__floating-label">Phone number</span>
                <div class="error" v-if="!$v.phone.required">Field is required</div>
                <div class="error" v-if="!$v.phone.phone">Please enter phone</div>
              </label>
            </div>
            <div :class="['form-group', { 'form-group--error': $v.company.$error }]">
              <label class="field__label" for="company">
                <input :class="['field__input', {'changed': company!=='' }]" id="company"
                  @input="onCompanyChange($event)"
                  v-model.trim="$v.company.$model"/>
                <span class="field__floating-label">Company name</span>
                <div class="error" v-if="!$v.company.required">Field is required</div>
              </label>
            </div>
          </div>

          <div class="field form__field">
            <label class="field__label">Add promocode if you have one:</label>
            <label class="field__label" for="promo">
              <input :class="['field__input', {'changed': promo!=='' }]" id="promo"
                @input="onPromoChange($event)"
                v-model.trim="promo"/>
              <span class="field__floating-label">Promocode</span>
            </label>
          </div>
          <a class="sixnines-btn multiservice__btn multiservice__btn--back"
            @click="onBackToParamClick">
            Back to parameters
          </a>
          <a class="sixnines-btn multiservice__btn multiservice__btn--finish"
            @click="onFinishClick">
            Finish order
          </a>
        </div>
        <div class="multiservice__form-total" v-else-if="isTotal">
          <label class="field__label">Your order:</label>
          <b class="multiservice__total">{{ chosenService }} service</b>
          <span class="multiservice__total">Total, GFPS: {{ totalGfps }}</span>
          <span class="multiservice__total">Total, €: {{ totalEuro }}</span>
          <div class="form__submit-wrap">
            <a class="sixnines-btn multiservice__btn multiservice__btn--back"
              @click="onBackToContactsClick">
              Back to contacts
            </a>
            <button :class="['sixnines-btn multiservice__btn multiservice__btn--order', {'loading': submitStatus === 'PENDING'}]"
              :disabled="submitStatus === 'ERROR'" type="submit">Make an order</button>
          </div>
        </div>
        <div class="multiservice__form-message" v-else-if="isSuccessful">
          <p>
            Thanks for choosing Six Nines cloud services. <br>We will contact you soon!
          </p>
        </div>
      </form>
    </multiContainer>
  </div>
</template>

<script>
import { required, email, between } from 'vuelidate/lib/validators';
import multiContainer from './Container';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import axios from '../../../libs/axios';

const phone = (value) => /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value);  //phone valid

export default {
  name: 'Form',
  data() {
    return {
      isParameters: true,
      isContacts: false,
      isTotal: false,
      isSuccessful: false,
      action: 'api/multi-service/',
      services: {
        name: 'service',
        tabs: [
          {
            name: 'services',
            title: 'Rendering',
            value: 'Rendering',
            id: 'rendering'
          },
          {
            name: 'services',
            title: 'Deep Learning',
            value: 'Deep Learning',
            id: 'dl'
          },
          {
            name: 'services',
            title: 'Password Recovery',
            value: 'Password Recovery',
            id: 'password'
          },
          {
            name: 'services',
            title: 'Mining: coming soon',
            value: 'mining',
            id: 'mining',
            isDisabled: true
          }
        ],
      },
      renderingAmount: 1,
      dlAmount: 1,
      passwordAmount: 1,
      submitStatus: 'OK',
      duration: 1,
      amount: 1,
      email: '',
      phone: '',
      company: '',
      promo: '',
      totalEuro: null,
      totalGfps: null
    }
  },
  validations: {
    email: {
      required,
      email
    },
    renderingAmount: {
      required,
      between: between(1, 200)
    },
    dlAmount: {
      required,
      between: between(1, 1000)
    },
    passwordAmount: {
      required,
      between: between(1, 1400)
    },
    phone: {
      required,
      phone
    },
    company: {
      required
    },
  },
  components: {
    multiContainer,
    VueSlider,
  },
  computed: {
    isRendering() {
      return this.$store.state.multiservice.service === 'Rendering';
    },
    isDL() {
      return this.$store.state.multiservice.service === 'Deep Learning';
    },
    isPassword() {
      return this.$store.state.multiservice.service === 'Password Recovery';
    },
    chosenService() {
      return this.$store.state.multiservice.service;
    }
  },
  mounted() {
    this.setActiveTab();
    this.$store.commit('setMultiserviceDuration', this.duration);
    this.$store.commit('setMultiserviceAmount', this.amount);
  },
  methods: {
    setActiveTab() {
      let _self = this;
      let activeIndex = this.$store.state.multiservice.mActiveIndex;

      setTimeout(function(){
        document.querySelector(`[data-value="${_self.services.tabs[activeIndex].value}"]`).classList.add('active');
      },1);
    },
    onConfirmClick() {
      let _self = this;
      this.countTotalEuro();
      this.countTotalGfps();

      setTimeout(function() {
        if(!document.querySelector('.error')) {
          _self.isParameters = false;
          _self.isContacts = true;
        }
      },1)
    },
    onFinishClick() {
      let _self = this;
      this.$v.$touch();

      setTimeout(function() {
        if(!document.querySelector('.error')) {
          _self.isTotal = true;
          _self.isContacts = false;
        }
      },1)
    },
    onBackToParamClick() {
      this.isParameters = true;
      this.setActiveTab();
    },
    onBackToContactsClick() {
      this.isContacts = true;
      this.isTotal = false;
      this.isParameters = false;
    },
    onCheckInput($event) {
      if (($event.charCode === 0 || /\d/.test(String.fromCharCode($event.charCode)) || $event.keyCode === 8 || $event.keyCode === 46)) {
        return true;
      } else {
        $event.preventDefault();
      }
    },
    setRendering(value) {
      this.renderingAmount = value;
      this.$v.renderingAmount.$touch();
    },
    submit() {
      let _self = this;

      let data = {
        service: this.$store.state.multiservice.service,
        amount: this.$store.state.multiservice.amount,
        duration: this.$store.state.multiservice.duration,
        email: this.$store.state.multiservice.email,
        company: this.$store.state.multiservice.company,
        phone: this.$store.state.multiservice.phone,
        promo: this.$store.state.multiservice.promocode,
        totalEuro: this.$store.state.multiservice.totalEuro,
        totalGfps: this.$store.state.multiservice.totalGfps
      };

      if (!this.$v.$invalid) {
        this.submitStatus = 'PENDING';

        axios.post(this.action, data)
          .then(function (response) {
            if(response.status === 200) {
              _self.isSuccessful = true;
              _self.isTotal = false;
            }

            this.submitStatus = 'OK';
          })
          .catch(function (response) {
              console.log(response);
          });
      }
    },
    onChangeSlider(val) {
      this.$store.commit('setMultiserviceDuration', +val);
    },
    onChangeInput() {
      this.$store.commit('setMultiserviceDuration', +this.duration);
    },
    onChangeAmount($event) {
      this.$store.commit('setMultiserviceAmount', $event.target.value);
    },
    onInputChange($event) {
      $event.target.classList.add('changed');
    },
    onEmailChange($event) {
      $event.target.classList.add('changed');
      this.$store.commit('setMultiserviceEmail', $event.target.value);
    },
    onPhoneChange($event) {
      $event.target.classList.add('changed');
      this.$store.commit('setMultiservicePhone', $event.target.value);
    },
    onCompanyChange($event) {
      $event.target.classList.add('changed');
      this.$store.commit('setMultiserviceCompany', $event.target.value);
    },
    onPromoChange($event) {
      $event.target.classList.add('changed');
      this.$store.commit('setMultiservicePromo', $event.target.value);
    },
    countTotalEuro() {
      let price;
      let amount;
      let serviceId = this.$store.state.multiservice.id;
      let duration = this.$store.state.multiservice.duration;
      let total;

      switch (serviceId) {
        case 'rendering': {price = 5; amount = this.renderingAmount;}
        break;
        case 'dl': {price = 11; amount = this.dlAmount;};
        break;
        case 'password': {price = 8; amount = this.passwordAmount;};
      }

      total = price * amount * duration;
      this.totalEuro = total;
      this.$store.commit('setMultiserviceEuro', this.totalEuro);
    },
    countTotalGfps() {
      this.totalGfps = this.totalEuro / 1000;
      this.$store.commit('setMultiserviceGfps', this.totalGfps);
    }
  }
}
</script>

<style lang="scss">
.multiservice__form {
  background: $gray-dark-color;
  padding-top: 80px;
  padding-bottom: 80px;

  .field + .field {
    margin-top: 60px;
  }

  .field__label {
    font-size: 20px;
    display: block;
    margin-bottom: 30px;
  }

  .form__field {
    input {
      width: 550px;
    }
  }

  .form-group {
    &--error input {
      border-color: red;
    }
  }

  .error {
    font-size: 14px;
  }

  .field--duration {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 60px;

    .field__label {
      width: 100%;
    }

    .error {
      width: 100%;
    }
  }

  @include bp(0 tablet) {
    .tabs {
      flex-wrap: wrap;
    }

    .tabs__item {
      width: 100%;
      margin-right: 0;
      margin-bottom: 20px;
    }

    .form__field {
      input {
        width: 100%;
      }
    }

  }
}

.multiservice__slider {
  width: 302px;

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

  @include bp(0 420px) {
    width: 100%;
  }
}

.multiservice__slider-val {
  width: 70px;
  margin-left: 20px;
  margin-top: -29px;

  input {
    font-size: 30px;
    letter-spacing: .9;
    color: $blue-color;
    text-align: right;
    width: 55px;
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

  @include bp(0 420px) {
    margin-left: 0;
    margin-top: 20px;
  }
}

.multiservice__btn {
  display: inline-block;
  vertical-align: top;

  &:focus {
    outline: none;
  }

  &--back,
  &--finish,
  &--order {
    max-width: 266px;
  }
}

.multiservice__total {
  font-size: 18px;
  display: block;
  margin-bottom: 20px;
}

.multiservice__form .form__field .field__input {
  &--amount {
    width: 302px;
  }

  @include bp(0 420px) {
    &--amount {
      width: 100%;
    }
  }
}

.form__submit {
  @include bp(0 mobile) {
    margin-top: 0;
  }
}

.multiservice__form-message {
  padding: 60px;
  text-align: center;

  p {
    font-size: 20px;
  }
}
</style>
