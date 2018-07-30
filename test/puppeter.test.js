// import 'babel-polyfill';

// import puppeteer from 'puppeteer';

// puppeteer
//     .launch({
//         args: [
//             "--no-sandbox"
//         ]
//     })
//     .then(async browser => {
//         const page = await browser.newPage();
//         await page.goto("http://hyper.uuorks.com/hyper/");

//         const reduxBtn = await page.evaluate(() => {
//             var button = document.querySelector("hyper-redux");
//             var container = button.querySelector(".container");
//             container.click();

//             return container.className;
//         });

//         console.log(reduxBtn);

//         // other actions...
//         await browser.close();
//     });