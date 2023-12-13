const mongoose = require('mongoose');

const workSchema = mongoose.Schema({
  id: {type: Number, required: false},
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  categoryId: { type: Number, required: true },
  userId: { type: Number, required: true },
  category: [
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model('Work', workSchema);