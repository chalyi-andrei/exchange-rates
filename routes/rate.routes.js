const { Router } = require('express');
const moment = require('moment');

const ObmenkaRate = require('../models/ObmenkaRate');
const Obmenka48hRate = require('../models/Obmenka48');
const Money24Rate = require('../models/Money24Rate');
const Money48Rate = require('../models/Money48');
const { obmenkaScrape, money24Scrape } = require('../helpers/puppeteer');

const router = Router();

// api/rate/obmenka
router.get('/obmenka', async (req, res) => {
  const currentDate = moment();
  const data = await ObmenkaRate.find().sort({ date: 1 });
  const data48 = await Obmenka48hRate.find().sort({ date: 1 });
  const latestPlusDay = moment.unix(data[data.length - 1].date).add(1, 'd');
  const latestPlus4Hours = moment.unix(data48[data48.length - 1].date).add(4, 'h');

  let dataFromSite = null;
  let newData = null;

  if (latestPlusDay.isBefore(currentDate)) {
    dataFromSite = await obmenkaScrape();
    newData = {
      title: 'USD - UAH',
      buy: dataFromSite.USD.buy,
      sell: dataFromSite.USD.sell,
      date: currentDate.unix(),
    };

    const rate = new ObmenkaRate(newData);
    const currentRate = await rate.save();
    data.push(currentRate);
  }

  console.log('latestPlus4Hours', latestPlus4Hours.format('DD MM, mm:mm'));
  console.log('currentDate', moment().format('DD MM, hh:mm'));

  if (latestPlus4Hours.isBefore(currentDate)) {
    console.log('latestPlus4Hours!!! =)');
    if (!dataFromSite) {
      dataFromSite = await obmenkaScrape();
    }
    if (!newData) {
      newData = {
        title: 'USD - UAH',
        buy: dataFromSite.USD.buy,
        sell: dataFromSite.USD.sell,
        date: currentDate.unix(),
      };
    }

    const rate = new Obmenka48hRate(newData);
    const currentRateData = await rate.save();
    data48.push(currentRateData);
  }

  res.status(200).json({ message: 'ok', data: { USD: data, data48h: data48 } });
});

// api/rate/money24
router.get('/money24', async (req, res) => {
  const currentDate = moment();
  const data = await Money24Rate.find().sort({ date: 1 });
  const data48 = await Money48Rate.find().sort({ date: 1 });
  const latestPlusDay = moment.unix(data[data.length - 1].date).add(1, 'd');
  const latestPlus4Hours = moment.unix(data48[data48.length - 1].date).add(4, 'h');

  let dataFromSite = null;
  let newData = null;

  if (latestPlusDay.isBefore(currentDate)) {
    dataFromSite = await obmenkaScrape();
    newData = {
      title: 'USD - UAH',
      buy: dataFromSite.USD.buy,
      sell: dataFromSite.USD.sell,
      date: currentDate.unix(),
    };

    const rate = new Money24Rate(newData);
    const currentRate = await rate.save();
    data.push(currentRate);
  }

  if (latestPlus4Hours.isBefore(currentDate)) {
    if (!dataFromSite) {
      dataFromSite = await obmenkaScrape();
    }
    if (!newData) {
      newData = {
        title: 'USD - UAH',
        buy: dataFromSite.USD.buy,
        sell: dataFromSite.USD.sell,
        date: currentDate.unix(),
      };
    }

    const rate = new Money48Rate(newData);
    const currentRateData = await rate.save();
    data48.push(currentRateData);
  }

  res.status(200).json({ message: 'ok', data: { USD: data, data48h: data48 } });
});

module.exports = router;
