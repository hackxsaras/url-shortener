const mongoose = require('mongoose');
const shortid = require('shortid');

const UrlSchema = new mongoose.Schema({
  urlCode: {
    type: String,
    unique: true
  },
  longUrl: String,
  date: { type: String, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Url', UrlSchema);
