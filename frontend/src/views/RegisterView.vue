<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { validateEmail, validatePassword, SERVER_ERROR } from '../utils/validation'
import { getCaptcha } from '../utils/captcha'

const router = useRouter()

const validForm = ref(false)

const captcha = ref('')
const captchaId = ref('')
const captchaImg = ref('')

const serverError = ref('')

const email = ref('')
const emailValidationMsg = ref('')

const password = ref('')
const passwordValidationMsg = ref('')
const passwordRepeat = ref('')
const passwordMatchMsg = ref('')

watch(email, () => {
  validateEmail(email, emailValidationMsg)
})

watch([password, passwordRepeat], () => {
  validatePassword(password, passwordRepeat, passwordValidationMsg, passwordMatchMsg)
})

watch([emailValidationMsg, passwordValidationMsg, passwordMatchMsg, captcha], () => {
  validForm.value =
    !email.value ||
    !password.value ||
    !passwordRepeat.value ||
    emailValidationMsg.value ||
    passwordValidationMsg.value ||
    passwordMatchMsg.value ||
    !captcha.value
      ? false
      : true
})

async function submitRegistration(e) {
  e.preventDefault()

  const data = {
    username: email.value,
    password: password.value,
    captcha: captcha.value,
    captchaId: captchaId.value,
  }
  try {
    const res = await fetch('/auth/register', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('auth', data.access_token)
      router.push('/')
    } else if (res.status === 500) {
      throw new Error(SERVER_ERROR)
    } else {
      const error = await res.json()
      throw new Error(error.message)
    }
  } catch (error) {
    console.error(error)
    serverError.value = error.message
    getCaptcha(captcha, captchaId, captchaImg)
  }
}

getCaptcha(captcha, captchaId, captchaImg)
</script>

<template>
  <main>
    <h1>
      <RouterLink to="/login">Login</RouterLink>
      / Register
    </h1>
    <form @submit="submitRegistration">
      <label for="">
        Enter your email
        <input type="email" v-model="email" required />
      </label>
      <div class="validation-msg">{{ emailValidationMsg }}</div>

      <label>
        Make up a password
        <input type="password" v-model="password" required />
      </label>
      <div class="validation-msg">{{ passwordValidationMsg }}</div>
      <label>
        Repeat your password
        <input type="password" v-model="passwordRepeat" required />
      </label>
      <div class="validation-msg">{{ passwordMatchMsg }}</div>

      <label>
        Captcha
        <img :src="captchaImg" alt="" />
        <input
          v-model="captcha"
          type="text"
          placeholder="Enter the characters from the picture above (case insensetive)"
          required
        />
        <input type="text" hidden v-model="captchaId" />
      </label>
      <br />

      <input type="submit" :disabled="!validForm" />
    </form>
    <div class="validation-msg">{{ serverError }}</div>
  </main>
</template>

<style>
main,
form,
label {
  display: flex;
  flex-direction: column;
  justify-content: start;
}

label {
  font-size: 18px;
  /*margin-bottom: 10px;*/
}

.validation-msg {
  display: block;
  height: 15px;
  color: #ff5733;
  /*margin-bottom: 15px;*/
}

img {
  margin-bottom: 10px;
}
</style>
