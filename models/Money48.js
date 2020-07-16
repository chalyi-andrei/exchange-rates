const { Schema, model } = require('mongoose');

const schema = Schema({
  from: { type: String, default: 'Money24' },
  title: { type: String, required: true },
  buy: { type: String, required: true },
  sell: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = model('Money48hRate', schema, 'Money48hRate');
