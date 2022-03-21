const fruits = require('./models/model');
const { data } = require('./data');
const express = require("express");
const app = express();
const connect = require("./db/database");
require("dotenv").config();

const port = 3000 || process.env.PORT;

const start = async () => {
  try {
      await connect(process.env.MONGO_URI);
      await fruits.deleteMany();
      await fruits.create(data);
    app.listen(port, () => {
      console.log(`Server listening st port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start(); 
