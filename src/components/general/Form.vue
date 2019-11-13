<template>
  <div class="sixnines-form">
    <form
      class="form--login"
      :action="action"
      v-if="isLogin"
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
        <div :class="['field form__field field--password', {'field--error': $v.password.$error}]">
          <label class="field__label" for="password">
            <input class="field__input" id="password" type="text" @input="onInputChange($event)"
              v-model.trim="$v.password.$model"/>
              <span class="field__floating-label">Password</span>
          </label>
          <div class="field__error" v-if="!$v.password.required">Field is required</div>
        </div>
      </div>
      <div class="form__submit-wrap">
        <button class="form__submit sixnines-btn"
          type="submit"
          v-html="buttonText"
          :disabled="submitStatus == 'ERROR'"></button>
        <a class="form__link" @click="onForgotClick">Forgot password?</a>
      </div>
    </form>
    <form
      class="form--reg"
      :action="action"
      v-if="isReg"
      @submit.prevent="submit">
      <div class="form__fields">
        <div :class="['field form__field field--name', {'field--error': $v.name.$error}]">
          <label class="field__label" for="name">
            <input class="field__input" id="name" type="text"
              v-model.trim="$v.name.$model" @input="onInputChange($event)"/>
              <span class="field__floating-label">Name</span>
          </label>
          <div class="field__error" v-if="!$v.email.required">Field is required</div>
          <div class="field__error" v-if="!$v.email.email">Please enter email</div>
        </div>
        <div :class="['field form__field field--email', {'field--error': $v.email.$error}]">
          <label class="field__label" for="email">
            <input class="field__input" id="email" type="text"
              v-model.trim="$v.email.$model" @input="onInputChange($event)"/>
              <span class="field__floating-label">Email</span>
          </label>
          <div class="field__error" v-if="!$v.email.required">Field is required</div>
          <div class="field__error" v-if="!$v.email.email">Please enter email</div>
        </div>
        <div :class="['field form__field field--password', {'field--error': $v.password.$error}]">
          <label class="field__label" for="password">
            <input class="field__input" id="password" type="text" @input="onInputChange($event)"
              v-model.trim="$v.password.$model"/>
              <span class="field__floating-label">Password</span>
          </label>
          <div class="field__error" v-if="!$v.password.required">Field is required</div>
        </div>
      </div>
      <div class="form__submit-wrap">
        <button class="form__submit sixnines-btn"
          type="submit"
          v-html="buttonText"
          :disabled="submitStatus == 'ERROR'"></button>
      </div>
    </form>
    <form
      class="form--forgot"
      :action="action"
      v-if="isForgot"
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
      </div>
      <div class="form__submit-wrap">
        <button class="form__submit sixnines-btn"
          type="submit"
          v-html="buttonText"
          :disabled="submitStatus == 'ERROR'"></button>
        <a class="form__link" @click="backToLogin">Back to login</a>
      </div>
    </form>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';

export default {
  name: 'Form',
  components: {
  },
  props: {
    action: {
      type: String,
      default: '/'
    },
    buttonText: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default: function () {
        return [
          {
            name: 'email',
            type: 'email',
            required: 'true',
            value: '',
            label: 'Email'
          },
        ]
      }
    },
  },
  data() {
    return {
      submitStatus: null,
      email: '',
      name: '',
      password: ''
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
  computed: {
    isLogin () {
      return this.$store.state.user.isLogin;
    },
    isReg () {
      return this.$store.state.user.isReg;
    },
    isForgot () {
      return this.$store.state.user.isForgot;
    }
  },
  methods: {
    onInputChange($event) {
      $event.target.classList.add('changed');
    },
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log('error');
        this.submitStatus = 'ERROR';
      } else {
        // do your submit logic here
        if (this.$store.state.user.isForgot) {
          this.$store.commit('setLogin');
        }

        this.submitStatus = 'PENDING';
        setTimeout(() => {
          this.submitStatus = 'OK';
        }, 500);
      }
    },
    onForgotClick() {
      this.$store.commit('setForgot');
    },
    backToLogin() {
      this.$store.commit('setLogin');
    }
  }
}
</script>

<style lang="scss">
.field {
  & + & {
    margin-top: 28px;
  }
}

.field__input {
  font-size: 20px;
  font-family: $font-secondary;
  color: #fff;
  border: none;
  border-bottom: 2px solid rgba(#fff, .2);
  background: transparent;
  padding: 8px 5px;
  width: 100%;

  &:focus {
    outline: none;
  }
}

.field__label {
  position: relative;
}

.field__floating-label {
  font-family: $font-secondary;
  font-size: 20px;
  color: rgba(#fff, .4);
  letter-spacing: 1.2px;
  position: absolute;
  left: 0;
  top: 0;
  transition: .2s ease all;
  cursor: text;

  .field__input:focus ~ &,
  .field__input.changed ~ & {
    font-size: 10px;
    top: -16px;
    left: 1px;
  }
}

.form__submit {
  margin-top: 49px;
}

.field__error {
  display: none;
  margin-top: 4px;
}

.field--error {
  input {
    border-color: red;
  }

  .field__error {
    display: block;
  }
}

.form__link {
  cursor: pointer;
}
</style>
