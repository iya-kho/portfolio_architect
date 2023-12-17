const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  id: { type: Number, required: false },
  name: { type: String, required: true },
});

module.exports = mongoose.model('Category', categorySchema);
