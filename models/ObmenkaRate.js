const { Schema, model } = require('mongoose');

const schema = Schema({
  title: { type: String, required: true },
  buy: { type: String, required: true },
  sell: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = model('ObmenkaRate', schema, 'ObmenkaRate');
