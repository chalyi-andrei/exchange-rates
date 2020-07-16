const { Schema, model } = require('mongoose');

const schema = Schema({
  from: { type: String, default: 'ObmenkaKh' },
  title: { type: String, required: true },
  buy: { type: String, required: true },
  sell: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = model('Obmenka48hRate', schema, 'Obmenka48hRate');
