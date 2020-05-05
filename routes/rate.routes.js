const { Router } = require('express');
const moment = require('moment');

const ObmenkaRate = require('../models/ObmenkaRate');
const Money24Rate = require('../models/Money24Rate');
const { obmenkaScrape, money24Scrape } = require('../helpers/puppeteer');

const router = Router();

// api/rate/obmenka
router.get('/obmenka', async (req, res) => {
  const data = await ObmenkaRate.find().sort({ date: 1 });
  const currentDate = moment();
  const latestExchangeDate = moment.unix(data[data.length - 1].date).add(4, 'h');

  console.log('latestExchangeDate', latestExchangeDate);

  if (latestExchangeDate.isBefore(currentDate)) {
    console.log('isBefore!!!');
    console.log('latestExchangeDate', latestExchangeDate);
    console.log('currentDate', currentDate);

    const dataFromSite = await obmenkaScrape();
    const newData = {
      title: 'USD - UAH',
      buy: dataFromSite.USD.buy,
      sell: dataFromSite.USD.sell,
      date: currentDate,
    };

    // const rate = new ObmenkaRate(newData);
    // const currentRateData = await rate.save();
    // data.push(currentRateData);
  }

  res.status(200).json({ message: 'ok', data: { USD: data } });
});

// api/rate/money24
router.get('/money24', async (req, res) => {
  const data = await Money24Rate.find().sort({ date: 1 });
  const currentDate = moment();
  const latestExchangeDate = moment.unix(data[data.length - 1].date).add(1, 'd');

  if (latestExchangeDate.isBefore(currentDate)) {
    //  const dataFromSite = await money24Scrape();
    // const newData = {
    //   title: 'USD - UAH',
    //   buy: dataFromSite.USD.buy,
    //   sell: dataFromSite.USD.sell,
    //   date: currentDate,
    // };
    // const rate = new Money24Rate(newData);
    // const currentRateData = await rate.save();
    // data.push(currentRateData);
  }

  res.status(200).json({ message: 'ok', data: { USD: data } });
});

module.exports = router;
