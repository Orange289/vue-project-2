<template>
<div class="forgot__main" v-if="!isResetMessage">
  <h2>Reset password</h2>
  <p>Please enter your new password, confirm it, and click submit button</p>
  <form
    class="form--forgot"
    :action="action"
    @submit.prevent="submit">
    <div class="form__fields">
      <div :class="['field form__field field--password', {'field--error': $v.password1.$error || password1Error.length > 0}]">
        <label class="field__label" for="password1">
          <input class="field__input" id="password1" type="password"
            v-model.trim="$v.password1.$model" @input="onInputChange($event)"/>
            <span class="field__floating-label">New password</span>
        </label>
        <div class="field__error" v-if="!$v.password1.required">Field is required</div>
        <div class="field__error" v-if="!$v.password1.minLength">Password must have at least 8 letters</div>
        <div class="field__error" v-if="password1Error.length > 0">{{password1Error}}</div>
      </div>
      <div :class="['field form__field field--password', {'field--error': $v.password2.$error || password2Error.length > 0}]">
        <label class="field__label" for="password2">
          <input class="field__input" id="password2" type="password"
            v-model.trim="$v.password2.$model" @input="onInputChange($event)"/>
            <span class="field__floating-label">Confirm password</span>
        </label>
        <div class="field__error" v-if="!$v.password2.required">Field is required</div>
        <div class="field__error" v-if="!$v.password2.sameAsPassword">Passwords must be identical</div>
        <div class="field__error" v-if="password2Error.length > 0">{{password2Error}}</div>
      </div>
    </div>
    <div class="form__submit-wrap">
      <button
        :class="['form__submit', 'sixnines-btn', {'loading': submitStatus === 'PENDING'}]"
        type="submit"
        :disabled="submitStatus === 'ERROR'">Submit</button>
      <a class="form__link" @click="backToLogin">Back to login</a>
    </div>
  </form>
</div>
<div class="forgot__reset" v-else>
  <h2>Reset password</h2>
  <p>Your password successfully changed. You may now log-in using your new credentials.</p>
  <btn href="/">Main page</btn>
</div>
</template>

<script>
import { required, sameAs, minLength } from 'vuelidate/lib/validators';
import axios from '../../../libs/axios';

export default {
    name: "ResetPassword",
    components: {},
    data() {
        return {
            submitStatus: null,
            isResetMessage: false,
            action: 'api/reset-password/',
            password1: '',
            password2: '',
            password1Error: '',
            password2Error: '',
        }
    },
    validations: {
        password1: {
            required,
            minLength: minLength(8),
        },
        password2: {
            required,
            sameAsPassword: sameAs('password1')
        },
    },
    methods: {
        submit() {
            this.submitStatus = 'PENDING';
            this.$v.$touch();
            if (!this.$v.$invalid) {
                const vm = this;
                axios.put(this.action, {
                    token: this.$route.query.restore,
                    password1: this.password1,
                    password2: this.password2,
                })
                    .then(result => {
                        if(result.status === 202) {
                            this.isResetMessage = true;
                        }
                        this.submitStatus = 'OK';
                    })
                    .catch(error => {
                        if(error.response.status === 400) {
                            if(error.response.data.token) {
                                vm.password1Error = error.response.data.token[0];
                            }
                            if(error.response.data.password1) {
                                vm.password1Error = error.response.data.password1[0];
                            }
                            if(error.response.data.password2) {
                                vm.password2Error = error.response.data.password2[0];
                            }
                        } else {
                            //TODO: Handle somehow or not
                            alert('Something went wrong');
                        }
                    })
            }
        },
        onInputChange($event) {
            $event.target.classList.add('changed');
        },
        backToLogin() {
          this.$store.commit('setLogin');
        }
    },
}
</script>
