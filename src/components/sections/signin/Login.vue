<template>
  <div class="login">
    <reg-template>
      <smallHeader />
      <template v-slot:breadcrumbs>
        <breadcrumbs :items="breadcrumbs" />
      </template>
      <template v-slot:leftTitle>Login</template>
      <template v-slot:authForm>
        <form
          class="form form--login"
          :action="action"
          @submit.prevent="submit">
          <div class="form__fields">
            <div :class="['field form__field field--email', {'field--error': $v.email.$error}]">
              <label class="field__label" for="email">
                <input class="field__input" id="email" type="text"
                  v-model.trim="$v.email.$model" @input="onInputChange($event)"/>
                  <span class="field__floating-label">Email</span>
              </label>
              <div class="field__error" v-if="!$v.email.required">Field is required</div>
              <div class="field__error" v-if="!$v.email.email">Please enter email</div>
            </div>
            <div :class="['field form__field field--password',
                {'field--error': $v.password.$error || passwordError || otherError.length > 0}]">
              <label class="field__label" for="password">
                <input class="field__input" id="password" type="password" @input="onInputChange($event)"
                  v-model.trim="$v.password.$model"/>
                  <span class="field__floating-label">Password</span>
              </label>
              <div class="field__error" v-if="!$v.password.required">Field is required</div>
              <div class="field__error" v-if="passwordError">Invalid email or password</div>
              <div class="field__error" v-if="otherError.length > 0">{{ otherError }}</div>
            </div>
          </div>
          <div class="form__submit-wrap">
            <button class="form__submit sixnines-btn"
              type="submit"
              :disabled="submitStatus === 'ERROR'">Login</button>
            <a class="form__link" @click="onForgotClick">Forgot password?</a>
          </div>
        </form>
      </template>
      <template v-slot:rightTitle>First time here?</template>
      <template v-slot:desc>Enter your personal details and start to create your own world with us.</template>
      <template v-slot:rightBtn >
        <btn class="login__reg-btn" :btnAction="onRegClick">Registration</btn>
      </template>
    </reg-template>
  </div>
</template>

<script>
import smallHeader from './../../general/SmallHeader.vue';
import RegTemplate from './../../general/RegTemplate.vue';
import { required, email } from 'vuelidate/lib/validators';
import axios from '../../../libs/axios';
import { Methods } from './../../../libs/api/methods';

export default {
  name: 'Login',
  components: {
    smallHeader,
    RegTemplate
  },
  data() {
    return {
      breadcrumbs: [
        {
          id: 'home',
          name: 'home',
          url: ''
        },
        {
          id: 'farm',
          name: 'render farm',
          url: ''
        },
        {
          id: 'login',
          name: 'login',
          url: '',
          isActive: true
        },
      ],
      submitStatus: 'OK',
      action: 'api/auth-token/',
      email: '',
      password: '',
      passwordError: false,
      otherError: '',
      datetime: this.$store.state.datetime,
      createOrderData: 'api/order/'
    }
  },
  computed: {
    isBadRequestError() {
      return this.$store.state.errors.isBadRequestError;
    },
    isTimeOccupiedError() {
      return this.$store.state.errors.isTimeOccupiedError;
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  methods: {
    onRegClick () {
      this.$store.commit('setReg');
    },
    async createOrder() {
      await Methods.createOrder();
    },
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const vm = this;
        axios.post(this.action, {
            username: this.email,
            password: this.password,
        }).then(result => {
            if(result.status === 200) {
                // If authentication successful
              this.passwordError = false;
              this.$store.commit('setAuthentication', {
                  isAuthorized: true,
                  token: result.data.token,
                  userId: result.data.userId,
                  email: this.email,
              });

              if (this.$store.state.isOrderCreation) {
                this.createOrder();
              } else {
                this.$router.push('/clientsarea/');
                this.$store.commit('setOrdersPage'); // Redirecting authenticated user on clientsarea orders page
              }
            }
            this.submitStatus = 'OK';
        }).catch((error) => {
            if(error.response.status === 400) {
                vm.passwordError = true;
                vm.submitStatus = 'OK';
            } else {
                vm.passwordError = false;
                vm.otherError = 'Something went wrong';
                vm.submitStatus = 'OK';
            }
        });
      }
    },
    onInputChange($event) {
      $event.target.classList.add('changed');
    },
    onForgotClick() {
      this.$store.commit('setForgot');
    },
  },
}
</script>

<style lang="scss">
.login {
  .form__submit {
    display: inline-block;
    margin-right: 22px;
  }

  .field--email {
    width: 570px;
  }

  .field--password {
    width: 260px;
  }

  @include bp(0 desktop--big) {
    .reg-template__right h2 {
      margin-bottom: 67px;
    }

    .reg-template__right p {
      margin-bottom: 88px;
    }
  }
}

.login__reg-btn {
  max-width: 210px;
}
</style>
