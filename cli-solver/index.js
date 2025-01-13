const TwoCaptcha = require("@2captcha/captcha-solver")
const APIKEY = process.env.APIKEY;

const pollingInterval = 5
let jwt_token = ''

const solver = new TwoCaptcha.Solver(APIKEY, pollingInterval)

async function getCaptcha() {
    const res = await fetch('http://localhost:3000/auth/captcha')
    const captcha = await res.json()
    console.log("got captcha")
    return captcha
}

async function solveCaptcha(captcha) {
//async function solveCaptcha() {
    //const captcha = await getCaptcha()
    
    const res = await solver.imageCaptcha({
        body: captcha,
        numeric: 0,
        min_len: 6,
        max_len: 6
    })
    console.log(res)
    return res

    //solver.imageCaptcha({
        ////body: imageBase64,
        //body: captcha.img,
        //numeric: 0,
        //min_len: 6,
        //max_len: 6
    //})
    //.then((res) => {
    //console.log(res);
    //})
    //.catch((err) => {
    //console.log(err);
    //})
}

async function login(email, password) {
    let captcha = await getCaptcha()
    let solution = await solveCaptcha(captcha.img)

    const loginData = {
            username: email,
            password: password,
            captcha: solution.data,
            captchaId: captcha.id,
        }

    const res = await fetch('http://localhost:3000/auth/login', {
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(loginData)
            });
    if (res.ok) {
        console.log('res OK: ');
        const data = await res.json()
            console.log(data)
            jwt = data.access_token
        return true
    } else {
        console.log('login failed')
        //throw new Error('Something went wrong, we are workingon it, please try again after some time')
        return false
    }
}

async function showDashboard() {
    let logedIn = false;
    while(!logedIn) {
        logedIn = await login('fdasf@jlkjlkgk.fudsafoi', 'Ab!12345')
    }
    
    const res = await fetch('http://localhost:3000/auth/hello', {
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
        })
    const data = await res.text()
    console.log(data);
    return data
}


//solveCaptcha()
showDashboard()
