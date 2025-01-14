export function validateEmail(email, emailValidationMsg) {
  const validEmail = email.value.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  emailValidationMsg.value = validEmail ? '' : 'Email format is invalid'
}

export function validatePassword(
  password,
  passwordRepeat,
  passwordValidationMsg,
  passwordMatchMsg,
) {
  const validPassword = password.value.match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/,
  )
  passwordValidationMsg.value = validPassword
    ? ''
    : 'Password must be at least 8 characters long contain a number and an uppercase letter'

  const passwordMatches = password.value === passwordRepeat.value
  passwordMatchMsg.value = passwordMatches ? '' : 'Passwords do not match'
}

export const SERVER_ERROR =
  'Something went wrong, we are working on it, please try again after some time'
