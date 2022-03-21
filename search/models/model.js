const mongoose = require('mongoose');

const { Schema , model} = mongoose;

const fruits = new Schema({
  genus: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxlength: [20, "name cannot be more than 30"],
  },
  name: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxlength: [20, "name cannot be more than 30"],
  },
  family: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxlength: [20, "name cannot be more than 30"],
  },
  order: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxlength: [20, "name cannot be more than 30"],
  },
});

module.exports = model("fruits", fruits);