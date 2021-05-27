var mongoose = require("mongoose");

var sabzi = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
});

store = mongoose.model("store", sabzi);

module.exports = store;
