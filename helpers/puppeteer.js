const puppeteer = require('puppeteer');
const { USD_TITLE } = require('../constant');

const URI = {
  USD: {
    khObmenka: 'https://kharkov.obmenka.ua/ru/USD-UAH',
    money24: 'https://money24.kharkov.ua/usd-uah/',
  },
};

const obmenkaScrape = async () => {
  try {
    const browser = await puppeteer.launch();
    const obmenkaPage = await browser.newPage();
    await obmenkaPage.goto(URI.USD.khObmenka);

    const money24Data = await obmenkaPage.$$eval('.currency-list', (nodes) => {
      return nodes.map((node) => {
        const byUsd = node.querySelector('a[href^="/ru/USD-UAH"] .buy').innerText;
        const sellUsd = node.querySelector('a[href^="/ru/USD-UAH"] .sell').innerText;

        return {
          USD: {
            title: 'USD-UAH',
            buy: byUsd,
            sell: sellUsd,
          },
        };
      });
    });

    await browser.close();
    return money24Data[0];
  } catch (er) {
    console.log('err', er);
    return;
  }
};

const money24Scrape = async () => {
  try {
    const browser = await puppeteer.launch();
    const money24Page = await browser.newPage();
    await money24Page.goto(URI.USD.money24);

    const money24Data = await money24Page.$$eval('.rate-box_tabs-body.rate-info-holder', (nodes) => {
      return nodes.map((node) => {
        const byUsd = node.querySelector('.rate-info-box.rate-buy .rate-number').innerText;
        const sellUsd = node.querySelector('.rate-info-box.rate-sell .rate-number').innerText;
        return {
          USD: {
            title: 'USD-UAH',
            buy: byUsd,
            sell: sellUsd,
          },
        };
      });
    });

    await browser.close();
    return money24Data[0];
  } catch (er) {
    console.log('money24Scrape Error', er);
    return;
  }
};

module.exports = { obmenkaScrape, money24Scrape };
