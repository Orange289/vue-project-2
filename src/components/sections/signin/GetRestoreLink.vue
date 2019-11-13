<template>
  <div class="forgot__main" v-if="!isResetMessage">
    <h2>Forgot Password?</h2>
    <p>Please provide your email address which has been stated during the registration process.</p>
    <form
      class="form--forgot"
      :action="action"
      @submit.prevent="submit">
      <div class="form__fields">
        <div :class="['field form__field field--email', {'field--error': $v.email.$error ||serverError.length > 0}]">
          <label class="field__label" for="email">
            <input class="field__input" id="email" type="text"
              v-model.trim="$v.email.$model" @input="onInputChange($event)"/>
              <span class="field__floating-label">Email</span>
          </label>
          <div class="field__error" v-if="!$v.email.required">Field is required</div>
          <div class="field__error" v-if="!$v.email.email">Please enter email</div>
          <div class="field__error" v-if="serverError.length > 0">{{serverError}}</div>
        </div>
      </div>
      <div class="form__submit-wrap">
        <button
          :class="['form__submit', 'sixnines-btn', {'loading': submitStatus === 'PENDING'}]"
          type="submit"
          :disabled="submitStatus === 'ERROR'">Proceed</button>
        <a class="form__link" @click="backToLogin">Back to login</a>
      </div>
    </form>
  </div>
  <div class="forgot__reset" v-else>
    <h2>Reset or change password</h2>
    <p>We've e-mailed you instructions for setting your password to the e-mail address you submitted. You should be receiving it shortly.</p>
    <btn href="/">Main page</btn>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';
import axios from '../../../libs/axios';

export default {
    name: "GetRestoreLink",
    components: {},
    data() {
        return {
            submitStatus: null,
            action: 'api/restore-password/',
            email: '',
            isResetMessage: false,
            serverError: '',
        }
    },
    validations: {
      email: {
        required,
        email
      }
    },
    methods: {
      submit() {
        this.submitStatus = 'PENDING';
        this.$v.$touch();
        if (!this.$v.$invalid) {
            const vm = this;
            axios.post(this.action, {
                email: this.email
            })
              .then(response => {
                  if(response.status === 200) {
                    this.isResetMessage = true;
                  }
                  this.submitStatus = 'OK'
              })
              .catch(error => {
                  if(error.response.status === 400) {
                      vm.serverError = error.response.data.email[0];
                  } else
                      alert('Something went wrong');
                  this.submitStatus = 'OK';
              })
        }
      },
      onInputChange($event) {
        this.serverError = '';
        $event.target.classList.add('changed');
      },
      backToLogin() {
        this.$store.commit('setLogin');
      }
    }
}
</script>
