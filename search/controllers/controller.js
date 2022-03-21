const fruits = require("../models/model");
const CustomError = require("../error/customError");
const { type } = require("express/lib/response");

const getFruits = async (req, res) => {
  const { name, sort } = req.query;
  const queryObject = {};
  const sortArray = {};
  try {
    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
    }
    
    if (sort === "name") {
      sortArray.name = "asc";
    } else if (sort === "genus") {
      sortArray.genus = "asc";
    } else if (sort === "family") {
      sortArray.family = "asc";
    } else if (sort === "order") {
      sortArray.order = "asc";
    } else if (sort === "id") {
      sortArray.id = "asc";
    } else {
      sortArray.name = "asc";
    }
    console.log(sortArray);
    const fruitsReq = await fruits.find(queryObject).sort(sortArray);
    console.log(fruitsReq.length);
    return res
      .status(200)
      .json({ success: true, data: fruitsReq, noOfHits: fruitsReq.length });
  } catch (error) {
    console.log(error);
  }
};
const postFruits = async (req, res) => {
  const { genus, name, family, order } = req.body;
  const array = [genus, name, family, order];
  console.log(array);
  let found = array.some((item) => typeof item === "undefined");
  if (found) {
    return res
      .status(400)
      .json({ success: false, data: [], msg: "Required field not entered" });
  }
  try {
    const fruit = await fruits.create({
      genus,
      name,
      family,
      order,
    });

    if (fruit) {
      return res
        .status(200)
        .json({
          success: true,
          data: fruit,
          noOfHits: fruit.length,
          msg: `successfully created item`,
        });
    } else {
      return res
        .status(404)
        .json({ success: false, data: [], msg: "Not found" });
    }
  } catch (error) {
    console.log(error);
  }
};
const updateFruits = async (req, res) => {
  const { id: fruitID } = req.params;
  const { genus, name, family, order } = req.body;

  try {
    const fruit = await fruits.findByIdAndUpdate(
      fruitID,

      {
        genus,
        name,
        family,
        order,
      },
      {
        new: true,
        runValidators: true,
        overwrite: true,
      }
    );

    if (fruit) {
      return res.status(200).json({
        success: true,
        data: fruit,
        msg: `Successfully updated item ${fruitID}`,
      });
    }

    return res.status(404).json({ success: false, data: [], msg: "Not found" });
  } catch (error) {
    console.log(error);
  }
};
const deleteFruits = async (req, res) => {
  const { id: fruitID } = req.params;
  try {
    const fruit = await fruits.findByIdAndDelete(fruitID);
    if (fruit) {
      return res
        .status(200)
        .json({
          success: true,
          data: fruit,
          noOfHits: fruit.length,
          msg: `You deleted item ${fruitID}`,
        });
    }
    return res.status(404).json({ success: false, data: [], msg: "Not found" });
  } catch (error) {
    console.log(error);
  }
};
const getOneFruit = async (req, res) => {
  const { id: fruitID } = req.params;
  console.log(req.params);
  try {
    const fruit = await fruits.findById(fruitID);
    if (fruit) {
      return res
        .status(200)
        .json({ success: true, data: fruit, noOfHits: fruit.length });
    }
    return res.status(404).json({ success: false, data: [], msg: "Not found" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getFruits,
  getOneFruit,
  postFruits,
  deleteFruits,
  updateFruits,
};
