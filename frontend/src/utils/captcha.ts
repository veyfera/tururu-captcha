export async function getCaptcha(captcha, captchaId, captchaImg) {
  try {
    const res = await fetch('/auth/captcha')
    const data = await res.json()
    captchaImg.value = data.img
    captchaId.value = data.id
    captcha.value = ''
  } catch (err) {
    console.error(err)
  }
}
