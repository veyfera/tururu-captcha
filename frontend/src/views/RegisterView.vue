<script setup lang="ts">
import EmailInput from '../components/EmailInput.vue'
import { ref, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
//clean up, generalize, separate to components, clean up?
//make login page

const router = useRouter();

let captchaId = ref('');
let captcha = ref('');

let serverError = ref('');

/*let validForm = ref(false);*/
let validForm = ref(true);
const email = ref('');
let emailValidationMsg = ref('');
//ligit tripple validation

function validateEmail(e) {
    const validEmail = email.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    emailValidationMsg = validEmail ? '' : "Email format is invalid"
    validForm = true;
}

watch(email, validateEmail)
/*watch([email, password, passwordRepeat], validate)*/

const password = ref('');
const passwordRepeat = ref(''); /*const password = ref('Ab!12345');*/
/*const passwordRepeat = ref('Ab!12345');*/
let passwordValidationMsg = ref('');
let passwordMatchMsg= ref('');

function validatePassword() {
    const validPassword = password.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/)
    passwordValidationMsg = validPassword ? '' : 'Password must be at least 8 characters long contain a number and an uppercase letter';
    
    const passwordMatches = password.value === passwordRepeat.value;
    passwordMatchMsg = passwordMatches ? '' : 'Passwords do not match';
}

watch([password, passwordRepeat], validatePassword);

let imgSrc = ref('');
async function getCaptcha() {
    try {
        const res = await fetch('/auth/captcha');
        const data = await res.json()
        console.log(data)
        imgSrc.value = data.img
        captchaId.value = data.id

    } catch(e) {
        console.error(e)
    }
}
getCaptcha()

async function submitRegistration (e) {
    e.preventDefault();

    const data = {
        username: email.value,
        password: password.value,
        captcha: captcha.value,
        captchaId: captchaId.value,
    }
    try {
        const res = await fetch('/auth/register', {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify(data)
                });
        /*console.log('jsut res: ', res)*/
        if (res.ok) {
            console.log('res OK: ');
            const data = await res.json()
                console.log(data)
                localStorage.setItem('auth', data.access_token);
                router.push('/')
        } else {
            console.log('res not ok: ')
            throw new Error('Something went wrong, we are workingon it, please try again after some time')
        }

    } catch(error) {
        console.error(error);
        serverError = error;
    }
}
</script>

<template>
<main>
    <h1>
        <RouterLink to="/login">Login</RouterLink>
        / Register
    </h1>
    <div class="server-error">{{serverError}}</div>
    <form @submit="submitRegistration">
    <label for="">
        Enter your email
        <input type="email" v-model="email" required />
    </label>
    <div class="validation-msg">{{ emailValidationMsg }}</div>

    <br>

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

    <br>

<label>
    Captcha
    <img :src="imgSrc" alt="">
    <input v-model="captcha" type="text" placeholder="Enter the characters from the picture above (case insensetive)" required>
    <input type="text" hidden v-model="captchaId">
</label>
    <br>

    <input type="submit" :disabled="!validForm">
    </form>
</main>

</template>


<style>

main, form, label {
    display: flex;
    flex-direction: column;
justify-content: start;
}

.validation-msg {
display: block;
height: 15px;
color: #FF5733;
}

img {
margin-bottom: 10px;
}
</style>
