<template>
  <div class="register">
    <reg-template>
      <smallHeader />
      <template v-slot:breadcrumbs>
        <breadcrumbs :items="breadcrumbs" />
      </template>
      <template v-slot:leftTitle>Registration</template>
      <template v-slot:authForm>
        <form
          class="form form--reg"
          :action="action"
          @submit.prevent="submit" v-if="!isRegistered">
          <div class="form__fields">
            <div :class="['field form__field field--name',
                {'field--error': $v.name.$error ||customNameError.length > 0}]">
              <label class="field__label" for="name">
                <input class="field__input" id="name" type="text"
                  v-model.trim="$v.name.$model" @input="onInputChange($event)"/>
                  <span class="field__floating-label">Name</span>
              </label>
              <div class="field__error" v-if="!$v.name.required">Field is required</div>
              <div class="field__error" v-if="customNameError.length > 0">{{ customNameError }}</div>
            </div>
            <div :class="['field form__field field--email', {'field--error': $v.email.$error ||customEmailError.length > 0}]">
              <label class="field__label" for="email">
                <input class="field__input" id="email" type="text"
                  v-model.trim="$v.email.$model" @input="onInputChange($event)"/>
                  <span class="field__floating-label">Email</span>
              </label>
              <div class="field__error" v-if="!$v.email.required">Field is required</div>
              <div class="field__error" v-if="!$v.email.email">Please enter email</div>
              <div class="field__error" v-if="customEmailError.length > 0">{{ customEmailError }}</div>
            </div>
            <div :class="['field form__field field--password', {'field--error': $v.password.$error || customPasswordError.length > 0}]">
              <label class="field__label" for="password">
                <input class="field__input" id="password" type="password" @input="onInputChange($event)"
                  v-model.trim="$v.password.$model"/>
                  <span class="field__floating-label">Password</span>
              </label>
              <div class="field__error" v-if="!$v.password.required">Field is required</div>
              <div class="field__error" v-if="customPasswordError.length > 0">{{ customPasswordError }}</div>
            </div>
          </div>
          <div class="form__submit-wrap">
            <button
              :class="['form__submit', 'sixnines-btn', {'loading': submitStatus === 'PENDING'}]"
              type="submit"
              :disabled="submitStatus === 'ERROR'">Registration</button>
          </div>
        </form>
        <div class="register__message" v-else>
          <p>We've e-mailed you instructions for confirming your account. You should be receiving it shortly.</p>
          <p>While email sending is not ready, your password: <b>{{newPassword}}</b></p>
          <btn href="/">Main page</btn>
        </div>
      </template>
      <template v-slot:rightTitle>Welcome Back!</template>
      <template v-slot:desc>Enter your personal details and start to create your own world with us.</template>
      <template v-slot:rightBtn >
        <btn :btnAction="onLoginClick">Login</btn>
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
  name: 'Register',
  components: {
    RegTemplate,
    smallHeader,
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
          id: 'registration',
          name: 'registration',
          url: '',
          isActive: true
        },
      ],
      submitStatus: 'OK',
      createOrderData: 'api/order/',
      action: 'api/sign-up/',
      email: '',
      name: '',
      password: '',
      customEmailError: '',
      customNameError: '',
      customPasswordError: '',
      isRegistered: false,
      newPassword: '',
      datetime: this.$store.state.datetime,
    }
  },
  validations: {
    email: {
      required,
      email
    },
    name: {
      required
    },
    password: {
        required
    }
  },
  methods: {
    async createOrder() {
      await Methods.createOrder();
    },
    onLoginClick () {
      this.$store.commit('setLogin');
    },
    submit() {
      this.submitStatus = 'PENDING';
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const vm = this;
        axios.post(this.action, {
            email: this.email,
            user_name: this.name,
            password: this.password,
        })
          .then(response => {
            if(response.status === 201) {
                this.customNameError = '';
                this.customEmailError = '';
                this.$store.commit('setAuthentication', {
                    isAuthorized: true,
                    token: response.data.token,
                    userId: response.data.id,
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
          })
          .catch(error => {
            if(error.response.status === 400) {
              if(error.response.data.email)
                  vm.customEmailError = error.response.data.email[0];
              if(error.response.data.user_name)
                  vm.customNameError = error.response.data.user_name[0];
              if(error.response.data.password)
                  vm.customPasswordError = error.response.data.password[0];
            } else {
                //TODO: design error message
                alert('Something went wrong');
            }
            this.submitStatus = 'OK'
          });
      }
    },
    onInputChange($event) {
      $event.target.classList.add('changed');
    },
  }
}
</script>

<style lang="scss">
.register {
  .form__submit {
    max-width: 210px;
  }

  .field--name {
    width: 280px;
  }

  .field--email {
    width: 340px;
    margin-left: 40px;
  }

  .field--password {
    width: 260px;
  }

  .form {
    max-width: 700px;
  }

  .form__fields {
    display: flex;
    flex-wrap: wrap;
  }

  .field + .field {
    margin-top: 0;
  }

  .field:nth-child(3) {
    margin-top: 28px;
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

.register__message {
  p {
    margin-bottom: 55px;
    max-width: 480px;
  }

  .sixnines-btn {
    max-width: 210px;
  }
}
</style>
