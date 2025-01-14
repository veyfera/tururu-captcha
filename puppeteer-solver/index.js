import puppeteer from "puppeteer";
const APIKEY = process.env.APIKEY;
import { Solver } from "2captcha-ts";
const solver = new Solver(APIKEY);
let loggedin = false;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  await page.goto("http://localhost:5173/login");
  await page.waitForSelector("form");

  await page.type("input[name='email']", "email@mail.com");
  await page.type("input[name='password']", "Ab!12345");

  while(!loggedin) {
    const captchaImg = await page.$eval("img[alt=captcha]", img => img.getAttribute('src'))

    console.log("started solving captcha");
    try {
        const captcha = await solver.imageCaptcha({
            body: captchaImg,
            numeric: 0,
            min_len: 6,
            max_len: 6
        })
        console.log(captcha);
        await page.type("input[name='captcha']", captcha.data);

        await page.click("input[type='submit']");
        console.log('submit clicked')

        await page.waitForTimeout(3000);

        if (page.url() === "http://localhost:5173/") {
            loggedin = true;
        }
    } catch (err){
        console.error(err.message);
        continue;
    }
  }

  await page.waitForTimeout(5000);
  browser.close();
})();
