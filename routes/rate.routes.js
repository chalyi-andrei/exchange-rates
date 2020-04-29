const { Router } = require('express');
const moment = require('moment');

const ObmenkaRate = require('../models/ObmenkaRate');
const Money24Rate = require('../models/Money24Rate');
const { obmenkaScrape, money24Scrape } = require('../helpers/puppeteer');

const router = Router();

// api/rate/obmenka
router.get('/obmenka', async (req, res) => {
  const data = await ObmenkaRate.find();
  const currentDate = moment();
  const latestExchangeDate = moment(new Date(data[data.length - 1].date)).add(4, 'h');

  if (latestExchangeDate.isBefore(currentDate)) {
    const dataFromSite = await obmenkaScrape();
    const newData = {
      title: 'USD - UAH',
      buy: dataFromSite.USD.buy,
      sell: dataFromSite.USD.sell,
      date: currentDate,
    };

    const rate = new ObmenkaRate(newData);
    const currentRateData = await rate.save();
    data.push(currentRateData);
  }

  res.status(200).json({ message: 'ok', data: { USD: data } });
});

// api/rate/money24
router.get('/money24', async (req, res) => {
  const data = await Money24Rate.find();
  const currentDate = moment();
  const latestExchangeDate = moment(new Date(data[data.length - 1].date)).add(1, 'd');

  if (latestExchangeDate.isBefore(currentDate)) {
    const dataFromSite = await money24Scrape();
    const newData = {
      title: 'USD - UAH',
      buy: dataFromSite.USD.buy,
      sell: dataFromSite.USD.sell,
      date: currentDate,
    };

    const rate = new Money24Rate(newData);
    const currentRateData = await rate.save();
    data.push(currentRateData);
  }

  res.status(200).json({ message: 'ok', data: { USD: data } });
});

// api/rate/setObmenka
router.get('/setObmenka', async (req, res) => {
  const newData = {
    title: 'USD - UAH',
    buy: '27.0',
    sell: '27.2',
    date: moment(),
  };

  const rate = new ObmenkaRate(newData);
  await rate.save();

  res.status(200).json({ message: 'ok', date: newData });
});

// api/rate/setMoney24
router.get('/setMoney24', async (req, res) => {
  const newData = {
    title: 'USD - UAH',
    buy: '27.23',
    sell: '27.33',
    date: moment(),
  };

  const rate = new Money24Rate(newData);
  await rate.save();

  res.status(200).json({ message: 'ok', date: newData });
});

module.exports = router;
