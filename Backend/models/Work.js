const mongoose = require('mongoose');

const workSchema = mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: false },
  categoryId: { type: String, required: true },
  userId: { type: String, required: true },
  category: {
      _id: { type: String, required: true },
      name: { type: String, required: true },
    },
});


module.exports = mongoose.model('Work', workSchema);